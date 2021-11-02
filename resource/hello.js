class Hello {
  static inMemoryStore = [new Hello("Hello"), new Hello("Goodbye")];
  static getAll = async () => {
    return this.inMemoryStore;
  };

  static create = async (greeting) => {
    const hello = new Hello(greeting);
    this.inMemoryStore.push(hello);
  };

  constructor(greeting) {
    this.message = `${greeting}, world!!!`;
  }

  toObject = () => ({
    message: this.message,
  });
}

module.exports = Hello;
