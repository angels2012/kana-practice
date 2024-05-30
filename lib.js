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

export const isInArray = (value, array) => {
    return array.indexOf(value) > -1;
}
