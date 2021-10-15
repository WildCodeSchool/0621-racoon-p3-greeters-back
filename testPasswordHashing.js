const argon2 = require('argon2')

const hashingOptions = {
  type: argon2.argon2id,
  memoryCost: 2 ** 16,
  timeCost: 5,
  parallelism: 1
}

const hashPassword = plainPassword => {
  return argon2.hash(plainPassword, hashingOptions)
}

hashPassword('R4k00n2.21!').then(hashedPassword => {
  console.log(hashedPassword)
})

//R4k00n2.21!
