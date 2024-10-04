// Define a function named is_Int that checks if a number is an integer.
export function is_Int(num: number) {
    // Check if the input is not a number, if so, return false.
    if (typeof num !== 'number')
        return false; 
    return !isNaN(num) && !isNaN(parseInt(String(num), 10));
}