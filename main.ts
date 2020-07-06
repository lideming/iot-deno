
import { } from "https://deno.land/x/oak/mod.ts";
import { WebServer } from "./WebServer.ts";
import { UdpServer } from "./UdpServer.ts";

var webServer = new WebServer();
var udpServer = new UdpServer();

webServer.run();
udpServer.run();
