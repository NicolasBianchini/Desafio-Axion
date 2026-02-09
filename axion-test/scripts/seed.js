const axios = require('axios');

const API_URL = 'http://localhost:1337';

// Login como admin
const login = async () => {
    try {
        const response = await axios.post(`${API_URL}/admin/login`, {
            email: 'axioner@axion.company',
            password: 'Axioner123',
        });
        return response.data.data.token;
    } catch (error) {
        console.error('❌ Login failed!');
        console.error('Error:', error.response?.data || error.message);
        throw error;
    }
};

const seedPeople = async (token) => {
    const people = [
        { name: 'Albert Einstein', link: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop', published_at: new Date() },
        { name: 'Marie Curie', link: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop', published_at: new Date() },
        { name: 'Leonardo da Vinci', link: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop', published_at: new Date() },
        { name: 'Ada Lovelace', link: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop', published_at: new Date() },
        { name: 'Isaac Newton', link: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop', published_at: new Date() },
        { name: 'Nikola Tesla', link: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop', published_at: new Date() },
    ];

    for (const person of people) {
        try {
            await axios.post(`${API_URL}/people`, person, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log(`✅ Created person: ${person.name}`);
        } catch (error) {
            if (error.response?.status === 400) {
                console.log(`⚠️ Error creating ${person.name}:`, error.response.data);
            } else {
                console.log(`⚠️ Person ${person.name} may already exist`);
            }
        }
    }
};

const seedFoods = async (token) => {
    const foods = [
        { name: 'Pizza Margherita', link: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=400&fit=crop', published_at: new Date() },
        { name: 'Sushi', link: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=400&fit=crop', published_at: new Date() },
        { name: 'Hamburger', link: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop', published_at: new Date() },
        { name: 'Pasta Carbonara', link: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&h=400&fit=crop', published_at: new Date() },
        { name: 'Tacos', link: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=400&fit=crop', published_at: new Date() },
        { name: 'Ramen', link: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop', published_at: new Date() },
    ];

    for (const food of foods) {
        try {
            await axios.post(`${API_URL}/foods`, food, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log(`✅ Created food: ${food.name}`);
        } catch (error) {
            if (error.response?.status === 400) {
                console.log(`⚠️ Error creating ${food.name}:`, error.response.data);
            } else {
                console.log(`⚠️ Food ${food.name} may already exist`);
            }
        }
    }
};

const seedPlaces = async (token) => {
    const places = [
        { name: 'Tokyo', link: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=400&fit=crop', published_at: new Date() },
        { name: 'Paris', link: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=400&fit=crop', published_at: new Date() },
        { name: 'New York', link: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=400&fit=crop', published_at: new Date() },
        { name: 'London', link: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=400&fit=crop', published_at: new Date() },
        { name: 'Rio de Janeiro', link: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=400&h=400&fit=crop', published_at: new Date() },
        { name: 'Dubai', link: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=400&fit=crop', published_at: new Date() },
    ];

    for (const place of places) {
        try {
            await axios.post(`${API_URL}/places`, place, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log(`✅ Created place: ${place.name}`);
        } catch (error) {
            if (error.response?.status === 400) {
                console.log(`⚠️ Error creating ${place.name}:`, error.response.data);
            } else {
                console.log(`⚠️ Place ${place.name} may already exist`);
            }
        }
    }
};

const seed = async () => {
    try {
        console.log('🌱 Starting seed...\n');

        console.log('🔑 Logging in...');
        const token = await login();
        console.log('✅ Logged in\n');

        console.log('📝 Seeding people...');
        await seedPeople(token);

        console.log('\n📝 Seeding foods...');
        await seedFoods(token);

        console.log('\n📝 Seeding places...');
        await seedPlaces(token);

        console.log('\n✅ Seed completed!');
    } catch (error) {
        console.error('❌ Seed failed:', error.message);
        if (error.response) {
            console.error('Response:', error.response.data);
            console.error('Request URL:', error.config?.url);
            console.error('Request Data:', error.config?.data);
        }
    }
};

seed();
