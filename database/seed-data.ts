interface SeedData { 
    entries : SeedEntry[]
}

interface SeedEntry {
    description: string;
    status: string;
    createAt: number;
}

export const seedData: SeedData = {
    entries: [
        {
            description: 'Pendiente: Lorem ipsum prodfaflkasfjsal;fas',
            status: 'pending',
            createAt: Date.now()
        },
        {
            description: 'En Progreso: Lorem ipsum prodfaflkasfjsal;fasasfsadf',
            status: 'in-progress',
            createAt: Date.now() - 1000000
        },
        {
            description: 'Finalizada: Lorem ipsum prodfaflkasfjsal;fasfasfasdfasfsfsf',
            status: 'finished',
            createAt: Date.now() - 100000
        }
    ]
}