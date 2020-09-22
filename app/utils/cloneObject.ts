export default (object: Object) =>
  Object.assign(Object.create(Object.getPrototypeOf(object)), object);
