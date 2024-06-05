export const normalize = str => {
    let ans = false;
    if (str === "true" || str === true)
        ans = true;
    else if (str === "false" || str === false)
        ans = false;

    return ans;
};

export const getRandomInt = (max) => {
    return Math.floor(Math.random() * Math.floor(max));
}

export function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
};