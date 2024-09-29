export class NameAssginer {

    cnt = 1;

    getName(type: unknown): string {
        // TODO: check the type
        return `f${this.cnt++}`
    }
}