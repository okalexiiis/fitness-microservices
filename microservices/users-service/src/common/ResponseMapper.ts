export class Response {
    private data: any
    private code: number | 200
    private message: string | "peticion ejecutada con exito"

    constructor(data: any, code: number, message: string) {
        this.data = data
        this.code = code
        this.message = message
    }
}