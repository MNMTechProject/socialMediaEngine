# yourapp/management/commands/create_dummy_data.py
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.db import transaction
import random
from faker import Faker
from ...models import Profile

User = get_user_model()
fake = Faker()

BIOS = [
    "Love exploring new places and meeting new people! 🌎",
    "Coffee addict ☕ | Book lover 📚 | Tech enthusiast 💻",
    "Professional napper 😴 | Food lover 🍕",
    "Always learning, always growing 🌱",
    "Photography is my passion 📸",
    "Music lover 🎵 | Aspiring artist 🎨",
    "Fitness enthusiast 💪 | Healthy living advocate 🥗",
    "Dreamer by day, coder by night 💻",
    "Adventure seeker 🏃‍♂️ | Nature lover 🌲",
    "Spreading positivity one post at a time ✨"
]

class Command(BaseCommand):
    help = 'Creates dummy users with profiles and following relationships'

    def add_arguments(self, parser):
        parser.add_argument('total', type=int, help='Number of users to create')

    def handle(self, *args, **kwargs):
        total = kwargs['total']
        
        with transaction.atomic():
            # Create users with profiles
            self.stdout.write('Creating users...')
            users = []
            for i in range(total):
                username = fake.user_name()
                email = fake.email()
                try:
                    user = User.objects.create_user(
                        username=username,
                        email=email,
                        password='testpass123',
                        first_name=fake.first_name(),
                        last_name=fake.last_name()
                    )
                    
                    # Update profile
                    profile = user.profile
                    profile.bio = random.choice(BIOS)
                    profile.privacy = random.choice([True, False])
                    profile.nsfw_filter = random.choice([True, False])
                    profile.save()
                    
                    users.append(user)
                    self.stdout.write(f'Created user: {username}')
                except Exception as e:
                    self.stdout.write(self.style.ERROR(f'Error creating user: {str(e)}'))
                    continue

            # Create following relationships
            self.stdout.write('Creating following relationships...')
            for user in users:
                # Each user will follow 1-5 random users
                to_follow = random.sample(users, random.randint(1, min(5, len(users))))
                for follow_user in to_follow:
                    if follow_user != user:  # Don't follow yourself
                        try:
                            Profile.objects.toggle_follow(user, follow_user)
                            self.stdout.write(f'{user.username} is now following {follow_user.username}')
                        except Exception as e:
                            self.stdout.write(
                                self.style.ERROR(
                                    f'Error creating following relationship: {str(e)}'
                                )
                            )

            self.stdout.write(
                self.style.SUCCESS(
                    f'Successfully created {len(users)} users with profiles and following relationships'
                )
            )

        # Print test user credentials
        self.stdout.write('\nTest User Credentials:')
        for user in users[:5]:  # Print first 5 users
            self.stdout.write(f'Username: {user.username} | Password: testpass123')
