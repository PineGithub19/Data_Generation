import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ContactRequests {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', nullable: true })
  userId: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  subject: string;

  @Column('text')
  message: string;

  @Column({ default: 'NEW' })
  status: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @BeforeInsert()
  checkValidData() {
    const validationErrors: boolean[] = [];

    if (!this.name || !this.email || !this.subject || !this.message)
      console.log('Name, email, subject, and message are required fields.');

    validationErrors.push(this.checkValidName());
    validationErrors.push(this.checkValidEmail());
    validationErrors.push(this.checkvalidMessage());

    if (validationErrors.includes(false)) {
      console.log('Validation failed for one or more fields.');
      throw new Error('SKIP_INSERT');
    }
  }

  checkValidName() {
    if (this.name.trim() === '') {
      console.log('Name cannot be empty or whitespace.');
      return false;
    }
    if (this.name.length > 240) {
      console.log('Name must be less than 240 characters.');
      return false;
    }
    if (this.name[0] === ' ' || this.name[this.name.length - 1] === ' ') {
      console.log('Name cannot start or end with a space.');
      return false;
    }
    if (this.name[0] >= '0' && this.name[0] <= '9') {
      console.log('Name cannot start with a number.');
      return false;
    }
    if (!/^[a-zA-Z]/.test(this.name[0])) {
      console.log('Name cannot start with a special character.');
      return false;
    }
    return true;
  }

  checkValidEmail() {
    if (this.email.trim() === '') {
      console.log('Email cannot be empty or whitespace.');
      return false;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(this.email)) {
      console.log('Invalid email format.');
      return false;
    }
    if (this.email.length > 120) {
      console.log('Email must be less than 120 characters.');
      return false;
    }
    return true;
  }

  checkvalidMessage() {
    if (this.message.length < 50) {
      console.log('Message must be at least 50 characters long.');
      return false;
    }
    if (this.message.length > 250) {
      console.log('Message must be less than 250 characters.');
      return false;
    }
    if (this.message.trim() === '') {
      console.log('Message cannot be empty or whitespace.');
      return false;
    }
    return true;
  }
}
