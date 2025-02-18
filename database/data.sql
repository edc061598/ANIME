-- Insert sample users
INSERT INTO "users" ("userName", "email", "passwordHash") VALUES
('Alice Johnson', 'alice@example.com', 'hashedpassword1'),
('Bob Smith', 'bob@example.com', 'hashedpassword2'),
('Charlie Brown', 'charlie@example.com', 'hashedpassword3');

-- Insert sample anime shows
INSERT INTO "shows" ("title", "description", "image", "rating") VALUES
('Attack on Titan', 'Humanity fights for survival against man-eating Titans.', 'https://images.hdqwalls.com/download/attack-on-titan-season-4-ve-1366x768.jpg', 9.1),
('Death Note', 'A student discovers a notebook that lets him kill anyone.', 'https://wallpaperaccess.com/full/2026164.jpg', 9.0),
('Naruto', 'A young ninja seeks recognition and dreams of becoming Hokage.', 'https://wallpapercave.com/wp/XWazbNG.jpg', 8.6),
('One Piece', 'A young pirate sets out to find the legendary One Piece.', 'https://wallpapercave.com/wp/xJ49b9L.jpg', 9.2),
('Fullmetal Alchemist: Brotherhood', 'Two brothers use alchemy to search for the Philosopher’s Stone.', 'https://wallpaperaccess.com/full/1084967.jpg', 9.4),
('Demon Slayer', 'A boy joins a demon-slaying corps to avenge his family.', 'https://example.com/demonslayer.jpg', 8.7),
('Jujutsu Kaisen', 'A student joins a secret organization to battle cursed spirits.', 'https://example.com/jujutsukaisen.jpg', 8.8),
('My Hero Academia', 'A boy born without superpowers enrolls in a hero academy.', 'https://example.com/mha.jpg', 8.5),
('Steins;Gate', 'A group of friends accidentally invents time travel.', 'https://example.com/steinsgate.jpg', 9.1),
('Tokyo Ghoul', 'A student becomes part-ghoul after a deadly encounter.', 'https://example.com/tokyoghoul.jpg', 8.0),
('Hunter x Hunter', 'A boy embarks on a journey to find his legendary hunter father.', 'https://example.com/hxh.jpg', 9.0),
('Re:Zero', 'A young man is transported to another world with a time-reset ability.', 'https://example.com/rezero.jpg', 8.6),
('Code Geass', 'A rebel leader uses a supernatural power to fight an empire.', 'https://example.com/codegeass.jpg', 9.0),
('Sword Art Online', 'Players become trapped in a deadly virtual reality MMORPG.', 'https://example.com/sao.jpg', 7.8),
('Black Clover', 'A magicless boy dreams of becoming the Wizard King.', 'https://example.com/blackclover.jpg', 8.2),
('Bleach', 'A teenager gains the powers of a Soul Reaper to fight spirits.', 'https://example.com/bleach.jpg', 8.4),
('Vinland Saga', 'A Viking warrior seeks revenge for his father’s murder.', 'https://example.com/vinlandsaga.jpg', 8.9),
('Dr. Stone', 'A genius boy attempts to rebuild civilization after humanity is petrified.', 'https://example.com/drstone.jpg', 8.3),
('Erased', 'A man travels back in time to prevent a tragic event.', 'https://example.com/erased.jpg', 8.5),
('The Rising of the Shield Hero', 'A man is summoned to a fantasy world as a legendary hero.', 'https://example.com/shieldhero.jpg', 8.0),
('No Game No Life', 'Siblings dominate a fantasy world where everything is decided by games.', 'https://example.com/nogamenolife.jpg', 8.2),
('Parasyte: The Maxim', 'A student fights parasitic aliens that take over human bodies.', 'https://example.com/parasyte.jpg', 8.4),
('Akame ga Kill!', 'An assassin fights a corrupt empire.', 'https://example.com/akamegakill.jpg', 7.8),
('Fairy Tail', 'A wizard joins a legendary guild and embarks on magical adventures.', 'https://example.com/fairytail.jpg', 8.0),
('Psycho-Pass', 'A futuristic society monitors crime through AI analysis.', 'https://example.com/psychopass.jpg', 8.2);

-- Insert sample reviews
INSERT INTO "reviews" ("userId", "showId", "reviewText", "rating", "createdAt") VALUES
(1, 1, 'One of the best anime ever made!', 9.5, NOW()),
(2, 2, 'Incredible psychological thriller!', 9.3, NOW()),
(3, 3, 'A classic ninja tale with great fights.', 8.8, NOW()),
(1, 4, 'Amazing world-building and adventure.', 9.6, NOW()),
(2, 5, 'Masterpiece in storytelling.', 9.7, NOW());

-- Insert sample favorites
INSERT INTO "favorites" ("userId", "showId", "createdAt") VALUES
(1, 1, NOW()),  -- Alice loves Attack on Titan
(1, 2, NOW()),  -- Alice also likes Death Note
(2, 3, NOW()),  -- Bob likes Naruto
(3, 4, NOW()),  -- Charlie loves One Piece
(3, 5, NOW());  -- Charlie also enjoys Fullmetal Alchemist
