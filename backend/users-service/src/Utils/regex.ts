export class RegexUtils {
    static compare(text: string, regex: RegExp): boolean {
        return regex.test(text);
    }

    static isEmail(text: string): boolean {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text);
    }

    static isName(text: string): boolean {
        return /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s'-]+$/.test(text);
    }
}