import jsonn from '../configs/constants/key_words';

function keyWords(Q: any) {
    const result = [];

    for (let i in Q) {
        let uhuul = jsonn.filter((list: any, idx: number) => {
            let r = false;
            list.map((word: any) => {


                let query = Q[i];

                if (
                    (query.toLowerCase().substr(query.length - 1) === 'a') ||
                    (query.toLowerCase().substr(query.length - 1) === 'o')
                ) query = query.slice(0, query.length - 1);
                else if (
                    (query.toLowerCase().substr(query.length - 2) === 'as') ||
                    (query.toLowerCase().substr(query.length - 2) === 'os')
                ) query = query.slice(0, query.length - 2);

                if (
                    word.normalize("NFD").toLowerCase().replace(/[\u0300-\u036f]/g, "")
                        .search(
                            query.normalize("NFD").toLowerCase().replace(/[\u0300-\u036f]/g, "")
                        ) === 0
                ) r = true
            })
            return r;
        });

        result.push(uhuul)
    }

    const flatt = result.flat().flat();

    let uniqueChars: Array<any> = [];
    flatt.forEach((element) => {
        if (!uniqueChars.includes(element)) {
            uniqueChars.push(element);
        }
    });

    return uniqueChars;
}

export default keyWords;