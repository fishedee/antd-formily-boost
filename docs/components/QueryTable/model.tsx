import { range } from 'underscore';
export type User = {
    id: number;
    name: string;
    age: number;
};

type Page = {
    data: User[];
    count: number;
};

export const delay = (timeout: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, timeout);
    });
};

export default class Model {
    private data: User[];

    constructor(size: number) {
        this.data = range(size).map((single) => {
            return {
                id: single,
                name: 'fish_' + single,
                age: single + 100,
            };
        });
    }
    getData() {
        return this.data;
    }
    findData(filter: any, page: any): Page {
        let newData: User[] = this.data.filter((single) => {
            if (filter && filter.name && filter.name != '') {
                return single.name.indexOf(filter.name) != -1;
            }
            return true;
        });
        const pageIndex = (page.current - 1) * page.pageSize;
        const pageSize = page.pageSize;
        let result: Page = {
            data: newData.slice(pageIndex, pageIndex + pageSize),
            count: newData.length,
        };

        return result;
    }
    del(id: number) {
        const index = this.data.findIndex((single) => {
            return single.id == id;
        });
        if (index != -1) {
            this.data.splice(index, 1);
        }
    }
}
