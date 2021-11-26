/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-undef */
/* eslint-disable no-console */
import axios from 'axios';
import { personal, TrueManga, MangaData } from './models/classes/manga';
import { MangaModel } from './models/mangaModel';

// datos del manga
const main = async () => {
  const GetMangaFromApi = async () => {
    let Info : any[] = [];
    const Mangas : TrueManga[] = [];
    let Artista = '';
    let Autor = '';
    let Imagen = '';
    for (let x = 0; x < 2;) {
      for (let i = 0; i <= 9;) {
      // eslint-disable-next-line no-await-in-loop
      // eslint-disable-next-line no-loop-func
        await axios.get<TrueManga[]>(`https://api.mangadex.org/manga?includes[]=cover_art&includes[]=author&includes[]=artist&limit=100&offset=${x}${i}00`).then((res:any) => {
          Info.push(res.data.data);
          console.log(`${x}${i}00 cargado`);
        });
        i += 1;
      }
      x += 1;
    }
    Info = Info.flat(1);
    Info.forEach((Manga) => {
      let Personal: any;
      const Datos: MangaData = {
        ultimoVolumen: Manga.attributes.lastVolume,
        ultimoCapitulo: Manga.attributes.lastChapter,
        contentRating: Manga.attributes.contentRating,
        fechaCreacion: Manga.attributes.createdAt,
        fechaActualizacion: Manga.attributes.updatedAt,
        titulo: Manga.attributes.title.en,
        genero: Manga.attributes.publicationDemographic,
        estado: Manga.attributes.state,
      };
      Manga.relationships.forEach((relaciones: any) => {
        if (relaciones.attributes !== undefined) {
          if (relaciones.type === 'artist') {
            Artista = relaciones.attributes.name;
          }
          if (relaciones.type === 'author') {
            Autor = relaciones.attributes.name;
          }
          if (relaciones.type === 'cover_art') {
            Imagen = relaciones.attributes.fileName;
          }
        }
        const objects : personal = {
          artista: Artista,
          autor: Autor,
          imagen: Imagen,
          idImg: Manga.id,

        };
        Personal = objects;
      });
      const [tags] = Manga.attributes.tags;
      const tipo = Manga.type;
      const ApiID = Manga.id;
      const manga = new TrueManga(Datos, Personal, tags, tipo, ApiID);
      manga.instCover();
      Mangas.push(manga);
    });
    let a = 0;

    await Promise.all(Mangas.map(async (Manga) => {
      const saver = new MangaModel(Manga);
      await saver.save().then(() => console.log(`manga ${a} guardado`));
      a += 1;
      console.log('terminado');
    }));
  };

  const checker = [1010, 1106, 1252, 1211, 1992];
  const checkValues: Array<any> = [];
  await Promise.all(checker.map(async (x) => {
    checkValues.push(await MangaModel.find({ $_id: checker[x] }));
  }));
  if (checkValues.length < 3) {
    console.log('faltan Mangas');
    GetMangaFromApi();
  }
  console.log('guay');
};
main();
