interface Conversation {
  id: number;
  name: string;
  age: number;
  lastMessage: string;
  avatarColor: string;
}

const conversations: Conversation[] = [
  {
    id: 1,
    name: 'Léa',
    age: 24,
    lastMessage: "Salut! J'ai vu ton profil, je suis très intéressée",
    avatarColor: 'bg-[#F7C67B]',
  },
  {
    id: 2,
    name: 'Thomas',
    age: 27,
    lastMessage: 'Parfait! On se retrouve quand pour visiter?',
    avatarColor: 'bg-blue-300',
  },
];

export default function Messages() {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-dark-blue px-6 pt-10 pb-6">
        <h1 className="font-syne font-extrabold text-2xl text-white">Messages</h1>
        <p className="font-inter text-sm text-blue-300 mt-1">Messagerie — fonctionnalité à venir</p>
      </header>

      <ul className="divide-y divide-black/10">
        {conversations.map(c => (
          <li key={c.id}>
            <button className="w-full px-6 py-4 flex items-center gap-4 text-left hover:bg-gray-50 transition">
              <div className={`w-14 h-14 rounded-full flex-shrink-0 ${c.avatarColor}`} />
              <div className="flex-1 min-w-0">
                <p className="font-syne font-bold text-base text-dark-blue">
                  {c.name}, {c.age}
                </p>
                <p className="font-inter text-sm text-[#606060] truncate">{c.lastMessage}</p>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
