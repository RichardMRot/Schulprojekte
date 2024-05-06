interface User {
    name: String,
    password: String
}

let user1:User = {
    name: "test",
    password: "passwort123"
}

let user2:User = {
    name: "fast",
    password: "123bc"
}

let user3:User = {
    name: "Professor",
    password: "?sch1auUND_pr0!"
}

export let users:User[] = [
    user1, user2, user3
]