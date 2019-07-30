import  splitOn from  '../../src/utils/splitOn'

const data1  = [
    {a: 1, b:10},
    {a:2, b:10},
    {a:3, b:10},
    {a:4, b:0},
    {a:5, b:0},
    {a:6, b:10},
]

const data2  = [
    {a: 1, b:10},
    {a:2, b:10},
    {a:3, b:10},
    {a:4, b:0},
    {a:6, b:10},
    {a:7, b:10},
    {a:8, b:10},
    {a:9, b:0},
]

const data3 = [
    {a: 1, b:10}, 
]

const data4 = [
    {a: 1, b:0}, 
]

const data5  =  [
    {a: 1, b:0},
    {a: 2, b:10}, 
]

const data6  =  [
    {a: 1, b:10},
    {a: 2, b:0}, 
]

describe('splitOn', () => {
    it('splitsOn the value', () => {
        const split1 =  splitOn(data1, d => d.b === 0);
        expect(split1.length).toBe(2);
        expect(split1[0].length).toBe(3);
        expect(split1[1].length).toBe(1);
        expect(split1[1][0].a).toBe(6);

        const split2 = splitOn(data2, d=> d.b===0);
        expect(split2.length).toBe(2);
        expect(split2[0].length).toBe(3);
        expect(split2[1].length).toBe(3);

        const split3 = splitOn(data3, d => d.b===0);
        expect(split3.length).toBe(1);
        expect(split3[0].length).toBe(1);
        expect(split3[0][0].a).toBe(1);

        const split4 = splitOn(data4, d => d.b===0);
        expect(split4.length).toBe(0);

        const split5 = splitOn(data5, d=>d.b===0);
        expect(split5.length).toBe(1);
        expect(split5[0].length).toBe(1);
        expect(split5[0][0].a).toBe(2);

        const split6 = splitOn(data6, d=>d.b===0);
        expect(split6.length).toBe(1);
        expect(split6[0].length).toBe(1);
        expect(split6[0][0].a).toBe(1);
    })
})