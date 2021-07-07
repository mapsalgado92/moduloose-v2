export class Class {
  constructor(id, name) {
    this._id = id
    this._name = name
    this._types = []
    this._typology = "Class"
  }

  //GETTERS
  get id() {
    return this._id
  }
  get name() {
    return this._name
  }
  get types() {
    return this._types
  }

  get typeIds() {
    return this._types.map(type => type.id)
  }

  get typology() {
    return this._typology
  }

  //SETTERS
  set name(newName) {
    this._name = newName
  }



  //METHODS
  addType(type) {
    this._types = [...this._types, type]
    type.pointToParent = () => this.getSelf()

    return type
  }

  removeType(id) {
    this._types = this._types.filter(type => type.id !== id)

    return this
  }

  findType(id) {
    let found = this._types.find(type => type.id === id)
    if (found) {
      return found
    } else {
      console.log("Type not Fond")
    }
  }

  getSelf() {
    return this
  }
}

export class Type {
  constructor(id, name) {
    this._id = id
    this._name = name
    this._modules = []
    this._typology = "Type"
    this._pointToParent = () => null
  }

  //GETTERS
  get id() {
    return this._id
  }
  get name() {
    return this._name
  }
  get modules() {
    return this._modules
  }

  get moduleIds() {
    return this._modules.map(mod => mod.id)
  }

  get typology() {
    return this._typology
  }


  //SETTERS
  set name(newName) {
    this._name = newName
  }

  set pointToParent(newPointToParent) {
    return this._pointToParent = newPointToParent
  }

  //METHODS
  addModule(mod) {
    this._modules = [...this._modules, mod]
    mod.pointToParent = () => this.getSelf()
    return mod
  }

  removeModule(id) {
    this._modules = this._modules.filter(mod => mod.id !== id)
    return this
  }

  findModule(id) {
    let found = this._modules.find(mod => mod.id === id)
    if (found) {
      return found
    } else {
      console.log("Module not Fond")
    }
  }

  getSelf() {
    let self = this
    return self
  }

  getParent() {
    return this._pointToParent()
  }

}

export class Module {
  constructor(id, name, value) {
    this._id = id
    this._name = name
    this._value = value
    this._typology = "Module"
    this._pointToParent = null
  }

  //GETTERS
  get id() {
    return this._id
  }
  get name() {
    return this._name
  }
  get value() {
    return this._value
  }

  get typology() {
    return this._typology
  }




  //SETTERS
  set name(newName) {
    this._name = newName
  }

  set value(newValue) {
    this._value = newValue
  }

  set pointToParent(newPointToParent) {
    this._pointToParent = newPointToParent
  }



  //LOG
  logModule = () => {
    console.log(`Name: ${this._name}`, `Value: ${this._value}`)
  }

  getParent() {
    return this._pointToParent()
  }
}

