"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrueManga = void 0;
class TrueManga {
    // eslint-disable-next-line max-len
    constructor(Datos, Personal, tags, tipo, ApiID, id) {
        this.id = id;
        this.Datos = Datos;
        this.Personal = Personal;
        this.Tags = tags;
        this.tipo = tipo;
        this.apiID = ApiID;
    }
    instCover() {
        this.Personal.imagen = `$https://uploads.mangadex.org/covers/${this.apiID}/${this.Personal.imagen}.256.jpg`;
    }
    get tags() {
        return this.Tags;
    }
}
exports.TrueManga = TrueManga;
