import { ContactRequests } from '../entities/contactRequests.entity';
import { GeneratedContactRequest } from '../utils/types';
import { DataSource } from 'typeorm';

async function saveContactRequestsToDatabase(
  contacts: GeneratedContactRequest[],
  dataSource: DataSource,
) {
  const contactRequestRepo = dataSource.getRepository(ContactRequests);

  for (const contact of contacts) {
    const entity = contactRequestRepo.create({
      userId: contact.userId,
      name: contact.name,
      email: contact.email,
      subject: contact.subject,
      message: contact.message,
    });

    try {
      await contactRequestRepo.save(entity);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.message === 'SKIP_INSERT') {
        console.log(
          `Failed to save contact request from ${contact.email}:`,
          error,
        );
        continue;
      }
    }
  }
  console.log(`✅ Saved ${contacts.length} contact requests to database.`);
}

export default saveContactRequestsToDatabase;
