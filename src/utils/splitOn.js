/* splits on an empty value and returns constituent "chunks"
to be used in a line chart.
*/

export default function splitOn(data, splitCriterion) {
    const output = [];
    let current = [];
    data.forEach(d => {
        const dn = Object.assign({}, d);
        if (splitCriterion(dn)) {
            if  (current.length) {
                output.push(current.slice(0));
                current = []
            }
        }  else {
            current.push(dn);
        }
    })
    if (current.length) {
        output.push(current.slice(0))
    }
    return output
}