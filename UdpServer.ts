import { dataSets } from "./DataSet.ts";
import { config } from "./config.ts";

function formatAddr(addr: Deno.Addr) {
    if ('hostname' in addr) {
        return `${addr.hostname}:${addr.port}`;
    } else {
        return `${addr.transport}:${addr.path}`;
    }
}

const HeaderTypes = { iots: new TextEncoder().encode('iots') }

function bytesEquals(a: Uint8Array, b: Uint8Array) {
    return a.length == b.length && a.every((x, i) => x === b[i]);
}

export class UdpServer {
    listener = Deno.listenDatagram({
        hostname: "0",
        transport: "udp",
        port: config.udpPort
    });

    async run() {
        console.log(`UDP server listening... (${formatAddr(this.listener.addr)})`);
        while (true) {
            const [buf, addr] = await this.listener.receive();
            try {
                this.handleUdpPacket(buf, addr);
            } catch (error) {
                console.warn(`Error processing UDP packet from (${formatAddr(addr)}):`, error);
            }
        }
    }

    private handleUdpPacket(buf: Uint8Array, addr: Deno.Addr) {
        const addrStr = formatAddr(addr);
        console.log('UDP received: ' + JSON.stringify({
            str: new TextDecoder().decode(buf),
            addr: addrStr
        }));
        const headerType = buf.slice(0, 4);
        if (bytesEquals(headerType, HeaderTypes.iots)) {
            const text = new TextDecoder().decode(buf.slice(4));
            const lines = text.split('\n');
            if (lines[0] != config.clientToken) {
                console.warn(`unknown token from (${addrStr})`);
                return;
            }
            const cmd = lines[1].split(' ');
            if (cmd[0] == 'data') {
                const dataSet = dataSets.get(cmd[1])
                if (dataSet) {
                    dataSet.append(new Date().toISOString() + ',' + lines[2]);
                    this.listener.send(new TextEncoder().encode(`iots${config.clientToken}\ndata-ok`), addr);
                } else {
                    console.warn(`dataset ${cmd[1]} doesn't exist. (${addrStr})`);
                }
            } else {
                console.warn(`unknown cmd from (${addrStr})`);
            }
        } else {
            console.warn(`unknown header type from (${addrStr})`);
        }
    }
}