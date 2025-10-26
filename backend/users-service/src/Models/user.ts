export class User {
  public id: number;
  public email: string;
  public password_hash: string;
  public name: string;
  public age: number;
  public height: number; // en cm
  public weight: number; // en kg
  public goal: "lose_weight" | "gain_muscle" | "mantain";
  public created_at: string ;

  constructor(
    id: number,
    email: string,
    name: string,
    password_hash: string,
    age: number,
    height: number,
    weight: number,
    goal: "lose_weight" | "gain_muscle" | "mantain",
  ) {
    this.id = id
    this.email = email
    this.name = name
    this.password_hash = password_hash
    this.age = age
    this.height = height
    this.weight = weight
    this.goal = goal
    this.created_at = new Date().toISOString()
  }
}
