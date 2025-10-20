export class User {
    public id: number
    public nombre: string
    public email: string
    public password: string
    public edad: number
    public sexo: "M" | "F"
    public altura_cm: number
    public peso_kg: number 
    public fecha_registro: Date

    constructor(id: number, nombre: string, email:string, password: string, edad: number, sexo: "M" | "F", altura_cm: number, peso_kg : number) {
        this.id = id
        this.nombre = nombre 
        this.email = email 
        this.password = password
        this.edad = edad 
        this.sexo = sexo
        this.altura_cm = altura_cm
        this.peso_kg = peso_kg
        this.fecha_registro = new Date()
    }
}