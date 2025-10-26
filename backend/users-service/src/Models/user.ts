export class User {
  private _id: string;
  private _email: string;
  private _password_hash: string;
  private _name: string;
  private _age: number;
  private _height: number; // en cm
  private _weight: number; // en kg
  private _goal: "lose_weight" | "gain_muscle" | "mantain";
  private _created_at: Date;

  constructor(
    id: string,
    email: string,
    name: string,
    password_hash: string,
    age: number,
    height: number,
    weight: number,
    goal: "lose_weight" | "gain_muscle" | "mantain",
  ) {
    this._id = id
    this._email = email
    this._name = name
    this._password_hash = password_hash
    this._age = age
    this._height = height
    this._weight = weight
    this._goal = goal
    this._created_at = new Date()
  }
}
