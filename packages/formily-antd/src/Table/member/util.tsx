function getDataInIndex(data: any[], index: string): any {
    const indexArray = index.split('.');
    let current: any = data;
    for (let i = 0; i != indexArray.length; i++) {
        let single = indexArray[i];
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
    const lastDelimeter = index.lastIndexOf('.');
    const preIndex = index.substr(0, lastDelimeter);
    const lastIndex = index.substr(lastDelimeter + 1);

    //先查找前级的数据
    const current = getDataInIndex(data, preIndex);
    //再设置
    if (current) {
        current[lastIndex] = target;
    }
}

export { getDataInIndex, setDataInIndex };
