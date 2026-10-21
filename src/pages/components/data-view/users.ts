export const userRoles = ['admin', 'member', 'viewer'] as const;
export const userStatuses = ['active', 'invited', 'inactive'] as const;
export const userTeams = ['design', 'development', 'marketing', 'support'] as const;

export interface DemoUser {
  id: string;
  name: string;
  email: string;
  role: (typeof userRoles)[number];
  team: (typeof userTeams)[number];
  status: (typeof userStatuses)[number];
}

const initialUsers: DemoUser[] = [
  { id: 'user-1', name: 'Daniel Lopes', email: 'daniel.lopes@example.com', role: 'admin', team: 'development', status: 'active' },
  { id: 'user-2', name: 'Ana Costa', email: 'ana.costa@example.com', role: 'member', team: 'design', status: 'active' },
  { id: 'user-3', name: 'Miguel Santos', email: 'miguel.santos@example.com', role: 'viewer', team: 'marketing', status: 'invited' },
  { id: 'user-4', name: 'Inês Matos', email: 'ines.matos@example.com', role: 'member', team: 'support', status: 'active' },
  { id: 'user-carolina-matos', name: 'Carolina Matos', email: 'carolina.matos@example.com', role: 'member', team: 'design', status: 'active' },
  { id: 'user-5', name: 'Sofia Ribeiro', email: 'sofia.ribeiro@example.com', role: 'admin', team: 'design', status: 'active' },
  { id: 'user-6', name: 'Tiago Ferreira', email: 'tiago.ferreira@example.com', role: 'member', team: 'development', status: 'inactive' },
  { id: 'user-7', name: 'Beatriz Almeida', email: 'beatriz.almeida@example.com', role: 'viewer', team: 'support', status: 'active' },
  { id: 'user-8', name: 'Rafael Martins', email: 'rafael.martins@example.com', role: 'member', team: 'marketing', status: 'invited' },
  { id: 'user-9', name: 'Mariana Silva', email: 'mariana.silva@example.com', role: 'member', team: 'design', status: 'active' },
  { id: 'user-10', name: 'João Carvalho', email: 'joao.carvalho@example.com', role: 'admin', team: 'support', status: 'inactive' },
  { id: 'user-11', name: 'Duarte Sousa', email: 'duarte.sousa@example.com', role: 'viewer', team: 'development', status: 'active' },
  { id: 'user-12', name: 'Clara Fernandes', email: 'clara.fernandes@example.com', role: 'member', team: 'marketing', status: 'active' },
  { id: 'user-13', name: 'Pedro Gomes', email: 'pedro.gomes@example.com', role: 'member', team: 'support', status: 'invited' },
  { id: 'user-14', name: 'Leonor Rodrigues', email: 'leonor.rodrigues@example.com', role: 'viewer', team: 'design', status: 'active' },
  { id: 'user-15', name: 'Afonso Pereira', email: 'afonso.pereira@example.com', role: 'member', team: 'development', status: 'inactive' },
  { id: 'user-16', name: 'Carolina Rocha', email: 'carolina.rocha@example.com', role: 'admin', team: 'marketing', status: 'active' },
  { id: 'user-17', name: 'Tomás Neves', email: 'tomas.neves@example.com', role: 'viewer', team: 'support', status: 'invited' },
  { id: 'user-18', name: 'Marta Oliveira', email: 'marta.oliveira@example.com', role: 'member', team: 'design', status: 'active' },
];

const firstNames = ['Bruno', 'Filipa', 'Hugo', 'Catarina', 'Nuno', 'Teresa', 'Vasco', 'Rita', 'André', 'Luísa', 'Diogo', 'Matilde', 'Ricardo', 'Francisca', 'Gonçalo', 'Joana', 'Manuel', 'Adriana', 'Luís', 'Isabel'];
const lastNames = ['Azevedo', 'Monteiro', 'Teixeira', 'Figueiredo', 'Pinto', 'Moreira', 'Correia', 'Barbosa', 'Mendes', 'Cardoso'];

export const sampleUsers: DemoUser[] = [
  ...initialUsers,
  ...Array.from({ length: 200 - initialUsers.length }, (_, index) => {
    const number = initialUsers.length + index + 1;
    const firstName = firstNames[index % firstNames.length];
    const lastName = lastNames[Math.floor(index / firstNames.length) % lastNames.length];
    const emailName = `${firstName}.${lastName}`.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
    return {
      id: `user-${number}`,
      name: `${firstName} ${lastName}`,
      email: `${emailName}.${number}@example.com`,
      role: userRoles[index % userRoles.length],
      team: userTeams[index % userTeams.length],
      status: userStatuses[Math.floor(index / userRoles.length) % userStatuses.length],
    };
  }),
];
