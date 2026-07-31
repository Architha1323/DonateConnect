import { PrismaClient, UserRole, DonationStatus, ItemCategory, ItemCondition, NgoVerificationStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Clean DB
  await prisma.notification.deleteMany();
  await prisma.statusHistory.deleteMany();
  await prisma.donationItem.deleteMany();
  await prisma.pickupRequest.deleteMany();
  await prisma.donation.deleteMany();
  await prisma.beneficiaryRequest.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.beneficiary.deleteMany();
  await prisma.ngo.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  const admin = await prisma.user.create({
    data: { name: 'Admin User', email: 'admin@donateconnect.com', role: UserRole.ADMIN, isVerified: true },
  });

  const donor = await prisma.user.create({
    data: { name: 'Rahul Sharma', email: 'rahul@example.com', role: UserRole.DONOR, phone: '+91 9876543210', city: 'Mumbai' },
  });

  const ngoUser = await prisma.user.create({
    data: { name: 'Helping Hands', email: 'helping@example.com', role: UserRole.NGO },
  });

  const beneficiaryUser = await prisma.user.create({
    data: { name: 'Amit Kumar', email: 'amit@example.com', role: UserRole.BENEFICIARY },
  });

  // Create NGO Profile
  const ngo = await prisma.ngo.create({
    data: {
      userId: ngoUser.id,
      ngoName: 'Helping Hands Foundation',
      registrationNumber: 'NGO-2023-10293',
      address: '123 Charity Lane',
      city: 'Mumbai',
      state: 'Maharashtra',
      verificationStatus: NgoVerificationStatus.VERIFIED,
      categories: [ItemCategory.CLOTHES, ItemCategory.BOOKS],
    },
  });

  // Create Beneficiary Profile
  const beneficiary = await prisma.beneficiary.create({
    data: { userId: beneficiaryUser.id, householdSize: 4, needCategory: [ItemCategory.CLOTHES] },
  });

  // Create Donations
  const donation = await prisma.donation.create({
    data: {
      donorId: donor.id,
      ngoId: ngo.id,
      status: DonationStatus.COMPLETED,
      totalItems: 5,
      items: {
        create: [
          { itemName: 'Winter Jackets', category: ItemCategory.CLOTHES, quantity: 2, condition: ItemCondition.GOOD },
          { itemName: 'Textbooks', category: ItemCategory.BOOKS, quantity: 3, condition: ItemCondition.LIKE_NEW },
        ],
      },
      pickupRequest: {
        create: {
          address: '456 Donor St', city: 'Mumbai', state: 'MH', contactPhone: '9876543210',
          scheduledDate: new Date(), scheduledTime: '10:00 AM'
        }
      },
      statusHistory: {
        create: [
          { toStatus: DonationStatus.PENDING, changedById: donor.id, changedAt: new Date(Date.now() - 86400000 * 3) },
          { toStatus: DonationStatus.ACCEPTED, changedById: ngoUser.id, changedAt: new Date(Date.now() - 86400000 * 2) },
          { toStatus: DonationStatus.COMPLETED, changedById: ngoUser.id, changedAt: new Date() },
        ]
      }
    },
  });

  const pendingDonation = await prisma.donation.create({
    data: {
      donorId: donor.id,
      status: DonationStatus.PENDING,
      totalItems: 1,
      items: {
        create: [{ itemName: 'Old TV', category: ItemCategory.ELECTRONICS, quantity: 1, condition: ItemCondition.FAIR }],
      },
      pickupRequest: {
        create: {
          address: '456 Donor St', city: 'Mumbai', state: 'MH', contactPhone: '9876543210',
          scheduledDate: new Date(Date.now() + 86400000 * 2), scheduledTime: '2:00 PM'
        }
      },
      statusHistory: {
        create: [{ toStatus: DonationStatus.PENDING, changedById: donor.id }]
      }
    },
  });

  // Create Beneficiary Request
  await prisma.beneficiaryRequest.create({
    data: { beneficiaryId: beneficiary.id, category: ItemCategory.FURNITURE, quantity: 1, description: 'Need a study table for kids' },
  });

  console.log('Seed completed successfully.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
