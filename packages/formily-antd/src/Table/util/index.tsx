import { result } from 'underscore';

function getDataInIndex(data: any[], index: string): any {
    const indexArray = index.split('.');
    let current: any = data;
    for (let i = 0; i != indexArray.length; i++) {
        let single = indexArray[i];
        if (single == '') {
            continue;
        }
        if (typeof current == 'object') {
            if (current instanceof Array) {
                let index = single as unknown as number;
                if (index < current.length && index >= 0) {
                    current = current[index];
                } else {
                    //越界了
                    return undefined;
                }
            } else {
                if (current.hasOwnProperty(single)) {
                    current = current[single];
                } else {
                    //没有该key
                    return undefined;
                }
            }
        } else {
            //非Object与Array，退出吧
            return undefined;
        }
    }
    return current;
}

function setDataInIndex(data: any[], index: string, target: any) {
    let [preIndex, lastIndex] = parseIndex(index);

    //先查找前级的数据
    const current = getDataInIndex(data, preIndex);

    //再设置
    if (current) {
        current[lastIndex] = target;
    }
}

function parseIndex(index: string): [string, string] {
    let result: [string, string];
    const lastDelimeter = index.lastIndexOf('.');
    if (lastDelimeter < 0) {
        result = ['', index];
        return result;
    }
    const preIndex = index.substr(0, lastDelimeter);
    const lastIndex = index.substr(lastDelimeter + 1);
    result = [preIndex, lastIndex];
    return result;
}

export { getDataInIndex, setDataInIndex, parseIndex };
