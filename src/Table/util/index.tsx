import { result } from 'underscore';
import { RecursiveIndex } from '../member/recursiveRow';

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

function flatDataInIndex(
    data: any[],
    dataIndex: string,
    prevIndex: string,
    currentLevel: number,
    defaultValue: boolean,
    recursiveIndex?: RecursiveIndex,
    isEarilerStop?: boolean,
): string[] {
    let result: string[] = [];
    for (var i = 0; i != data.length; i++) {
        let single = data[i];
        //初始化每个值为false
        if (single[dataIndex] === undefined) {
            single[dataIndex] = defaultValue;
        }
        const currentIndex = prevIndex != '' ? prevIndex + '.' + i : i + '';
        if (single[dataIndex]) {
            result.push(currentIndex);
        }
        if (recursiveIndex) {
            //当上下级关联的时候，提前终止
            if (isEarilerStop && !single[dataIndex]) {
                continue;
            }
            let recursiveIndexName: string;
            if (recursiveIndex.type == 'recursive') {
                recursiveIndexName = recursiveIndex.recursiveIndex;
            } else {
                recursiveIndexName = recursiveIndex.childrenIndex[currentLevel];
            }
            let children = single[recursiveIndexName];
            if (children && children.length != 0) {
                let result2 = flatDataInIndex(
                    children,
                    dataIndex,
                    currentIndex + '.' + recursiveIndexName,
                    currentLevel + 1,
                    defaultValue,
                    recursiveIndex,
                    isEarilerStop,
                );
                result = result.concat(result2);
            }
        }
    }
    return result;
}

function fillDataInIndex(
    data: any[],
    dataIndex: string,
    oldSelectedRowKeys: string[],
    newSelectedRowKeys: string[],
) {
    //先建立一个map
    let newSelectedKeyMap: { [key in string]: boolean } = {};
    for (let i in newSelectedRowKeys) {
        let index = newSelectedRowKeys[i];
        newSelectedKeyMap[index] = true;
    }

    //对于每个旧值，设置为false
    for (let i = 0; i != oldSelectedRowKeys.length; i++) {
        let index = oldSelectedRowKeys[i];
        if (!newSelectedKeyMap[index]) {
            setDataInIndex(data, index + '.' + dataIndex, false);
        }
    }

    //对于每个新值，设置为true
    for (let i = 0; i != newSelectedRowKeys.length; i++) {
        let index = newSelectedRowKeys[i];
        setDataInIndex(data, index + '.' + dataIndex, true);
    }
}

export {
    getDataInIndex,
    setDataInIndex,
    parseIndex,
    flatDataInIndex,
    fillDataInIndex,
};
