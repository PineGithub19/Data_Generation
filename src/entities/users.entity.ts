import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  country: string;

  @Column({ name: 'postcode' })
  postcode: string;

  @Column()
  phone: string;

  @Column({ type: 'date' })
  dob: Date;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ default: 'user' })
  role: string;

  @Column({ default: true })
  enabled: boolean;

  @Column({ default: 0 })
  failedLoginAttempts: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  @BeforeInsert()
  checkValidData() {
    const validationErrors: boolean[] = [];

    if (!this.firstName || !this.lastName || !this.email)
      console.log('First name, last name, and email are required fields.');

    validationErrors.push(this.checkValidFirstName());
    validationErrors.push(this.checkValidLastName());
    validationErrors.push(this.checkValidEmail());
    validationErrors.push(this.checkValidPhone());
    validationErrors.push(this.checkValidAddress());
    validationErrors.push(this.checkValidPostalCode());
    validationErrors.push(this.checkValidCity());
    validationErrors.push(this.checkValidState());
    validationErrors.push(this.checkValidCountry());

    if (validationErrors.includes(false)) {
      console.log('Validation failed for one or more fields.');
      throw new Error('SKIP_INSERT');
    }
  }

  checkValidFirstName() {
    if (this.firstName.trim() === '') {
      console.log('First name cannot be empty or whitespace.');
      return false;
    }
    if (this.firstName.length > 40) {
      console.log('First name must be less than 40 characters.');
      return false;
    }
    if (
      this.firstName[0] === ' ' ||
      this.firstName[this.firstName.length - 1] === ' '
    ) {
      console.log('First name cannot start or end with a space.');
      return false;
    }
    if (this.firstName[0] >= '0' && this.firstName[0] <= '9') {
      console.log('First name cannot start with a number.');
      return false;
    }
    if (!/^[a-zA-Z]/.test(this.firstName[0])) {
      console.log('First name cannot start with a special character.');
      return false;
    }
    return true;
  }

  checkValidLastName() {
    if (this.lastName.trim() === '') {
      console.log('Last name cannot be empty or whitespace.');
      return false;
    }
    if (this.lastName.length > 20) {
      console.log('Last name must be less than 20 characters.');
      return false;
    }
    if (
      this.lastName[0] === ' ' ||
      this.lastName[this.lastName.length - 1] === ' '
    ) {
      console.log('Last name cannot start or end with a space.');
      return false;
    }
    if (this.lastName[0] >= '0' && this.lastName[0] <= '9') {
      console.log('Last name cannot start with a number.');
      return false;
    }
    if (!/^[a-zA-Z]/.test(this.lastName[0])) {
      console.log('Last name cannot start with a special character.');
      return false;
    }
    return true;
  }

  checkValidEmail() {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(this.email)) {
      console.log('Invalid email format.');
      return false;
    }
    if (this.email.length > 255) {
      console.log('Email must be less than 255 characters.');
      return false;
    }
    return true;
  }

  checkValidPhone() {
    if (this.phone.trim() === '') {
      console.log('Phone number is required.');
      return false;
    }
    if (this.phone.length < 10 || this.phone.length > 15) {
      console.log('Phone number must be between 10 and 15 characters.');
      return false;
    }
    if (!/^\d+$/.test(this.phone)) {
      console.log('Phone number can only contain numbers.');
      return false;
    }
    return true;
  }

  checkValidAddress() {
    if (this.address.trim() === '') {
      console.log('Address cannot be empty or whitespace.');
      return false;
    }
    if (this.address.length > 200) {
      console.log('Address must be less than 200 characters.');
      return false;
    }
    if (/[^a-zA-Z0-9\s,./-]/.test(this.address)) {
      console.log(
        'Address must not contain special characters except for comma, slash, dot, or hyphen.',
      );
      return false;
    }
    return true;
  }

  checkValidPostalCode() {
    if (this.postcode.trim() === '') {
      console.log('Postal code cannot be empty or whitespace.');
      return false;
    }
    if (/[^a-zA-Z0-9]/.test(this.postcode)) {
      console.log('Postal code can only contain alphanumeric characters.');
      return false;
    }
    return true;
  }

  checkValidCity() {
    if (this.city.trim() === '') {
      console.log('City cannot be empty or whitespace.');
      return false;
    }
    if (/[^a-zA-Z\s]/.test(this.country)) {
      console.log('City can only contain alphanumeric characters.');
      return false;
    }
    return true;
  }

  checkValidState() {
    if (this.state.trim() === '') {
      console.log('State cannot be empty or whitespace.');
      return false;
    }
    if (/[^a-zA-Z\s]/.test(this.country)) {
      console.log('State can only contain alphanumeric characters.');
      return false;
    }
    return true;
  }

  checkValidCountry() {
    if (this.country.trim() === '') {
      console.log('Country cannot be empty or whitespace.');
      return false;
    }
    if (/[^a-zA-Z\s]/.test(this.country)) {
      console.log('Country can only contain alphanumeric characters.');
      return false;
    }
    return true;
  }
}
