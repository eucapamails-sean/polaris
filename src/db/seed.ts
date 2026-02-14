import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { jurisdictions, legislativeBodies, politicalParties } from './schema';

async function seed() {
  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql);

  console.log('Seeding jurisdictions...');

  // Jurisdictions
  const [us] = await db.insert(jurisdictions).values({
    code: 'us',
    name: 'United States',
    level: 'national',
    country: 'US',
    isActive: true,
    timezone: 'America/New_York',
  }).onConflictDoUpdate({
    target: jurisdictions.code,
    set: { name: 'United States', isActive: true },
  }).returning();

  const [gb] = await db.insert(jurisdictions).values({
    code: 'gb',
    name: 'United Kingdom',
    level: 'national',
    country: 'GB',
    isActive: true,
    timezone: 'Europe/London',
  }).onConflictDoUpdate({
    target: jurisdictions.code,
    set: { name: 'United Kingdom', isActive: true },
  }).returning();

  console.log('Seeding legislative bodies...');

  // US Legislative Bodies
  await db.insert(legislativeBodies).values([
    {
      jurisdictionId: us.id,
      name: 'US Senate',
      type: 'upper',
      totalSeats: 100,
      currentTerm: '119th Congress',
    },
    {
      jurisdictionId: us.id,
      name: 'US House of Representatives',
      type: 'lower',
      totalSeats: 435,
      currentTerm: '119th Congress',
    },
  ]).onConflictDoNothing();

  // UK Legislative Bodies
  await db.insert(legislativeBodies).values([
    {
      jurisdictionId: gb.id,
      name: 'House of Commons',
      type: 'lower',
      totalSeats: 650,
    },
    {
      jurisdictionId: gb.id,
      name: 'House of Lords',
      type: 'upper',
    },
  ]).onConflictDoNothing();

  console.log('Seeding political parties...');

  // US Parties
  await db.insert(politicalParties).values([
    { jurisdictionId: us.id, name: 'Democratic Party', shortName: 'D', color: '#0015BC', ideology: 'centre-left' },
    { jurisdictionId: us.id, name: 'Republican Party', shortName: 'R', color: '#E9141D', ideology: 'centre-right' },
    { jurisdictionId: us.id, name: 'Independent', shortName: 'I', color: '#808080' },
  ]).onConflictDoNothing();

  // UK Parties
  await db.insert(politicalParties).values([
    { jurisdictionId: gb.id, name: 'Conservative Party', shortName: 'Con', color: '#0087DC', ideology: 'centre-right' },
    { jurisdictionId: gb.id, name: 'Labour Party', shortName: 'Lab', color: '#E4003B', ideology: 'centre-left', isRuling: true },
    { jurisdictionId: gb.id, name: 'Liberal Democrats', shortName: 'LD', color: '#FAA61A', ideology: 'centre' },
    { jurisdictionId: gb.id, name: 'Scottish National Party', shortName: 'SNP', color: '#FDF38E', ideology: 'centre-left' },
  ]).onConflictDoNothing();

  console.log('Seed complete!');
}

seed().catch(console.error);
