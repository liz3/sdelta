export default [
  {
    left: {
      name: { abstract: "Liz3", after: "LOL" },
      test: [{ x: { name: 123, x: "x", a: "a" } }, 321],
      location: { postcode: { number: 1337, str: "1337" } },
      hobbies: ["coding", "Nekos", "Cars", "xxx"],
      arr: [
        {
          lol: "xxx",
          bool: true,
          a: { b: { x: "test", c: { arr: [123], str: "Liz3" } } },
        },
      ],
    },
    right: {
      name: { abstract: "Liz3" },
      test: [{ x: { name: 456, x: "y", a: "a" } }, 321, 861],
      location: { postcode: { number: 1337, str: "10997" } },
      hobbies: ["Coding", "Nekos", "Music"],
      arr: [
        {
          lol: "xxx",
          bool: true,
          a: { b: { x: "test", c: { arr: [124], str: null } } },
        },
      ],
    },
    result: {
      name: { abstract: "Liz3" },
      test: [{ x: { name: 456, x: "y", a: "a" } }, 321, 861],
      location: { postcode: { number: 1337, str: "10997" } },
      hobbies: ["Coding", "Nekos", "Music"],
      arr: [
        {
          lol: "xxx",
          bool: true,
          a: { b: { x: "test", c: { arr: [124], str: null } } },
        },
      ],
    },
  },
  {
    opts: { fullArrays: true },
    left: { name: "test", arr: [123, 456] },
    diff: { arr: [123, 456, 789] },
    right: { name: "test", arr: [123, 456, 789] },
    result: { name: "test", arr: [123, 456, 789] },
  },
  {
    left: { name: "test", arr: [123, 456] },
    diff: { arr: { _dm_: { t: 1, a: { 2: 789 } } } },
    right: { name: "test", arr: [123, 456, 789] },
    result: { name: "test", arr: [123, 456, 789] },
  },
  {
    left: {},
    diff: undefined,
    right: {},
    result: {},
  },
  {
    left: [123, 456, {}],
    diff: undefined,
    right: [123, 456, {}],
    result: [123, 456, {}],
  },
  {
    left: [123, 456, {}],
    diff: { _dm_: { t: 1, a: { 3: 789 } } },
    right: [123, 456, {}, 789],
    result: [123, 456, {}, 789],
  },
  {
    left: {
      name: "Liz3",
      location: { country: "Germany" },
      kodingSkillz: ["c++", "java", "js", "go", "...", 123, true, {}],
    },
    diff: undefined,
    right: {
      name: "Liz3",
      location: { country: "Germany" },
      kodingSkillz: ["c++", "java", "js", "go", "...", 123, true, {}],
    },
    result: {
      name: "Liz3",
      location: { country: "Germany" },
      kodingSkillz: ["c++", "java", "js", "go", "...", 123, true, {}],
    },
  },
  {
    left: { a: { b: { c: 1 }, d: 2 } },
    right: { a: { b: { c: 3 }, d: 2 } },
    result: { a: { b: { c: 3 }, d: 2 } },
    diff: { a: { b: { c: 3 } } },
  },
  {
    left: {
      name: "Liz3",
      hobbies: ["Coding", "Nekos", { cars: [["audi"]] }],
      location: { country: "Germany", city: "Berlin", zip: "10097" },
    },
    right: {
      name: "Liz3",
      hobbies: ["Coding", "Nekos", { cars: ["BMW"] }],
      location: { country: "Germany", city: "Berlin", zip: 10097 },
    },
    result: {
      name: "Liz3",
      hobbies: ["Coding", "Nekos", { cars: ["BMW"] }],
      location: { country: "Germany", city: "Berlin", zip: 10097 },
    },
    diff: {
      hobbies: { 2: { cars: { 0: "BMW", _dm_: { t: 1 } } }, _dm_: { t: 1 } },
      location: { zip: 10097 },
    },
  },
  {
    left: 123,
    diff: 456,
    right: 456,
    result: 456,
  },
  {
    opts: {fullArrays: true},
    left: [123,456,789, {}, []],
    right: [123, 456,789, {}, {}],
    result: [123, 456,789, {}, {}]
  },
  {
    opts: {fullArrays: true},
    left: [123,456,789, [], {}],
    right: [123, 456,789, {}, []],
    result: [123, 456,789, {},[]]
  }
];
