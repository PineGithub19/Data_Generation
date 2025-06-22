import { User } from '../entities/users.entity';
import { GeneratedUser } from 'src/utils/types';
import { DataSource } from 'typeorm';

async function saveUsersToDatabase(
  users: GeneratedUser[],
  dataSource: DataSource,
) {
  const userRepo = dataSource.getRepository(User);

  for (const user of users) {
    const entity = userRepo.create({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
      address: user.address,
      city: user.city,
      state: user.state,
      country: user.country,
      postcode: user.postcode,
      phone: user.phone,
      dob: user.dob,
    });

    try {
      await userRepo.save(entity);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.message === 'SKIP_INSERT') {
        console.error(`Failed to save user ${user.email}:`, error);
        continue;
      }
    }
  }

  console.log(`✅ Saved ${users.length} users to database.`);
}

export default saveUsersToDatabase;
