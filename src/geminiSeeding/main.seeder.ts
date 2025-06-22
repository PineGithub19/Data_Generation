import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import generateUsers from '../utils/usersGeneration';
import saveUsersToDatabase from './saveUsers';
import generateContacts from '../utils/contactRequestsGeneration';
import saveContactRequestsToDatabase from './saveContactRequests';
import { GeneratedUser } from 'src/utils/types';

export default class MainSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    let remainingUsers = 500;
    let remainingContacts = 0;
    const standardLength = 50;
    let existingEmails: Set<string> = new Set();

    while (remainingUsers > 0) {
      const { users, generatedEmails } = (await generateUsers(
        standardLength,
        existingEmails,
      )) as {
        users: GeneratedUser[];
        generatedEmails: Set<string>;
      };
      existingEmails.clear();
      existingEmails = new Set([...existingEmails, ...generatedEmails]);
      await saveUsersToDatabase(users, dataSource);
      remainingUsers -= users.length;
    }

    while (remainingContacts > 0) {
      const contacts = await generateContacts(standardLength);
      await saveContactRequestsToDatabase(contacts, dataSource);
      remainingContacts -= contacts.length;
    }
  }
}
