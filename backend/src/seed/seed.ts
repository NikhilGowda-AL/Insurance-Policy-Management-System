/* eslint-disable no-console */
import mongoose from 'mongoose';
import { env } from '../config/env';
import { User } from '../models/User';
import { UserRole } from '../constants/roles';

async function seed(): Promise<void> {
  await mongoose.connect(env.mongoUri);
  console.log('Connected to MongoDB for seeding...');

  const existingAdmin = await User.findOne({ email: env.defaultAdminEmail });

  if (existingAdmin) {
    console.log(`Default admin already exists: ${env.defaultAdminEmail}`);
  } else {
    await User.create({
      name: env.defaultAdminName,
      email: env.defaultAdminEmail,
      password: env.defaultAdminPassword,
      role: UserRole.ADMIN,
      active: true
    });
    console.log(`Default admin created: ${env.defaultAdminEmail}`);
  }

  const existingAgent = await User.findOne({ email: 'agent.demo@ipms.local' });
  if (!existingAgent) {
    await User.create({
      name: 'Demo Agent',
      email: 'agent.demo@ipms.local',
      password: 'Agent@12345',
      role: UserRole.AGENT,
      active: true
    });
    console.log('Demo agent created: agent.demo@ipms.local / Agent@12345');
  } else {
    console.log('Demo agent already exists: agent.demo@ipms.local');
  }

  await mongoose.disconnect();
  console.log('Seeding complete.');
  process.exit(0);
}

seed().catch((error) => {
  console.error('Seeding failed', error);
  process.exit(1);
});
