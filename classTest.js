class Test {
    constructor(name) {
        this.name = name;
    }
}

let People = [];
People.push(new Test("Paul"));
People.push(new Test("Bob"));

console.log(People.sort((a, b) => a.name > b.name))
console.log(People.sort((a, b) => b.name > a.name))