const isEmpty = (value, type = 0) => {
    if (type === 1) {
        if (value === null || value === undefined || value.length === 0 || value === "") {
            return true
        } else {
            return false
        }
    } else {
        if (value === null || value === undefined || value.trim().length === 0 || value.trim() === "") {
            return true
        } else {
            return false
        }
    }
}

export default isEmpty