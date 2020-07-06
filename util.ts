
export function padNumber(obj: any, length: number) {
    return (obj.toString() as string).padStart(length, '0');
}

export function getISODate(d: Date) {
    return `${d.getFullYear()}-${padNumber(d.getMonth() + 1, 2)}-${padNumber(d.getDate(), 2)}`;
}