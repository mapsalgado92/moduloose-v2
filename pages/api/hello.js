import { Class, Type, Module } from "../../classes/dataClasses"

export default function handler(req, res) {
  const myClass = new Class(10, "POO")
  let myType = myClass.addType(new Type(100, "Openers"))
  myType.addModule(new Module(1000, "Opener (M)", "Estimado Sr. xxxNamexxx,\\n muchas gracias por contactarnos."))
  myType.addModule(new Module(1001, "Opener (M)", "Estimado Sra. xxxNamexxx,\\n muchas gracias por contactarnos."))
  myType = myClass.addType(new Type(101, "Closers"))
  myType.addModule(new Module(1002, "Closer (M)", "Gracias por su cooperación. Si tiene alguna duda no dude en contactarnos,\\n\\nCordialmente,\\nxxxAgentNamexxx"))
  myType = myClass.addType(new Type(102, "Ask for Screenshots"))
  myType.addModule(new Module(1003, "Ask for Screenshots", "xxxOpenerxxx\\n\\n Ejemplo de texto de email,\\n\\nMás ejemplo de e-mail\\n"))
  res.status(200).json(myClass)
}
