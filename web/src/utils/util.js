/**
 * 随机生成数字
 */
export function randomNumber() {
    const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
    if (arguments.length === 1) {
        let [length] = arguments
        let nums = [...Array(length).keys()].map((i) => (i > 0 ? random(0, 9) : random(1, 9)))
        return parseInt(nums.join(''))
    } else if (arguments.length >= 2) {
        let [min, max] = arguments
        return random(min, max)
    } else {
        return Number.NaN
    }
}

/**
 * 随机生成字符串
 */
export function randomString(length, chars) {
    if (!length) length = 1
    if (!chars) chars = '01234567890qwertyuiopasdfghjklzxcvbnm'
    let str = ''
    for (let i = 0; i < length; i++) {
        let num = randomNumber(0, chars.length - 1)
        str += chars[num]
    }
    return str
}

/**
 * UUID随机生成
 */
export function randomUUID() {
    let chars = '01234567890abcdef'
    return randomString(32, chars)
}

