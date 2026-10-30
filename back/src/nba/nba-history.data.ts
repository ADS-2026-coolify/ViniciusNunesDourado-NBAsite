export interface NbaEra {
  id: string;
  period: string;
  title: string;
  subtitle: string;
  accentColor: string;
  definingStat: { value: string; label: string };
  summary: string;
  fullStory: string;
  milestones: string[];
  icons: string[];
}

export interface NbaLegend {
  id: string;
  name: string;
  nickname: string;
  era: string;
  jersey: string;
  position: string;
  primaryTeam: string;
  teamAbbreviation: string;
  teamLogo: string;
  accentColor: string;
  headshot?: string;
  titles: number;
  mvps: number;
  finalsMvps: number;
  allStars: number;
  stats: {
    ppg: string;
    rpg: string;
    apg: string;
  };
  signatureMove: string;
  quote: string;
  bio: string;
}

export interface NbaDynasty {
  id: string;
  franchise: string;
  abbreviation: string;
  logo: string;
  color: string;
  titles: number;
  years: string[];
  definingLegends: string[];
  legacy: string;
}

export interface NbaRecord {
  id: string;
  category: 'Jogo Único' | 'Temporada' | 'Carreira' | 'Franquia';
  value: string;
  title: string;
  holder: string;
  team: string;
  dateOrSpan: string;
  context: string;
}

export interface NbaTriviaQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const NBA_HISTORY_DATA = {
  heroStats: [
    { label: 'Fundação da Liga', value: '1946', detail: '6 de junho em Nova York (BAA)' },
    { label: 'Franquias Atuais', value: '30', detail: '15 Leste • 15 Oeste' },
    { label: 'Maior Campeão', value: '18', detail: 'Boston Celtics (recorde isolado)' },
    { label: 'Alcance Global', value: '215+', detail: 'Países e territórios conectados' },
  ],

  courtEvolution: [
    {
      year: '1891',
      title: 'Cestas de Pêssego em Springfield',
      description:
        'Dr. James Naismith escreve as 13 regras originais do basquete em Massachusetts usando duas cestas de pêssego pregadas a 3,05m de altura — a mesma altura exata do aro até hoje.',
    },
    {
      year: '1946',
      title: 'Nasce a BAA (6 de Junho)',
      description:
        'Donos das principais arenas de hóquei fundam a Basketball Association of America. Em 1º de novembro de 1946, o New York Knicks vence o Toronto Huskies por 68-66 no primeiro jogo oficial.',
    },
    {
      year: '1949',
      title: 'A Fusão que Cria a NBA',
      description:
        'A BAA absorve a rival National Basketball League (NBL), batizando oficialmente a National Basketball Association com 17 equipes e George Mikan como sua primeira superestrela.',
    },
    {
      year: '1954',
      title: 'O Relógio de 24 Segundos Salva o Jogo',
      description:
        'Danny Biasone propõe o cronômetro de posse de 24 segundos após jogos lentos e travados. A média de pontuação salta imediatamente de 79 para 93 pontos por jogo.',
    },
    {
      year: '1976',
      title: 'Fusão NBA-ABA & Basquete Aéreo',
      description:
        'Quatro franquias da elétrica ABA (Nuggets, Pacers, Nets e Spurs) entram na NBA, trazendo Julius "Dr. J" Erving, o espírito do Slam Dunk Contest e o ritmo acrobático moderno.',
    },
    {
      year: '1979',
      title: 'A Linha de 3 Pontos',
      description:
        'Adotada da ABA, a linha de três pontos (7,24m no arco) transforma para sempre o espaçamento tático. Chris Ford (Celtics) converte a primeira bola tripla da história da NBA.',
    },
    {
      year: '1992',
      title: 'O Dream Team em Barcelona',
      description:
        'Jordan, Magic, Bird, Barkley e companhia encantam o planeta nas Olimpíadas de 1992, vencendo por média de 43,8 pontos e desencadeando a explosão internacional de talentos na NBA.',
    },
    {
      year: '2020–Hoje',
      title: 'Play-In, NBA Cup & Era Global',
      description:
        'Com o Torneio Play-In, a Copa da NBA e seis prêmios consecutivos de MVP conquistados por atletas internacionais, o basquete atinge o maior nível técnico e tático de todos os tempos.',
    },
  ],

  eras: [
    {
      id: 'pioneers',
      period: '1946 – 1956',
      title: 'A Gênese & Os Gigantes Pioneiros',
      subtitle: 'De ginásios enfumaçados ao relógio de 24 segundos',
      accentColor: '#d97706',
      definingStat: { value: '24s', label: 'Invenção do Shot Clock em 1954' },
      summary:
        'A década inaugural transformou um esporte universitário e regional em espetáculo profissional veloz.',
      fullStory:
        'Dominada pelo pivô de óculos George Mikan e o Minneapolis Lakers (5 títulos em 6 anos), a liga enfrentou seu maior desafio quando equipes seguravam a bola indefinidamente — culminando num infame placar de 19 a 18 em 1950. Em 1954, o relógio de 24 segundos revolucionou a física do esporte, enquanto Chuck Cooper, Nat "Sweetwater" Clifton e Earl Lloyd quebravam a barreira racial em 1950.',
      milestones: [
        '1º jogo oficial: NY Knicks 68 x 66 Toronto Huskies (01/11/1946)',
        'Quebra da barreira racial na NBA em 1950',
        'Minneapolis Lakers conquista a primeira dinastia (5 títulos)',
        'Introdução do garrafão mais largo e do relógio de 24 segundos',
      ],
      icons: ['George Mikan', 'Bob Cousy', 'Dolph Schayes', 'Earl Lloyd'],
    },
    {
      id: 'celtic-titans',
      period: '1957 – 1969',
      title: 'Império Celta vs. Força Sobre-Humana',
      subtitle: 'Bill Russell (11 anéis) contra os números mitológicos de Wilt Chamberlain',
      accentColor: '#10b981',
      definingStat: { value: '11/13', label: 'Títulos do Boston Celtics na era Russell' },
      summary:
        'A maior dinastia da história dos esportes americanos colidiu com o atleta estatisticamente mais dominante que já pisou numa quadra.',
      fullStory:
        'Sob a batuta de Red Auerbach e a defesa revolucionária de Bill Russell, o Boston Celtics venceu 11 campeonatos em 13 temporadas — incluindo 8 seguidos (1959–1966). Do outro lado, Wilt Chamberlain reescrevia o impossível: 100 pontos num único jogo em Hershey (1962) e média de 50,4 pontos por partida em 1961–62, enquanto Oscar Robertson registrava o primeiro triple-double de média em uma temporada inteira e Jerry West inspirava a silhueta oficial do logo da NBA.',
      milestones: [
        '8 títulos consecutivos do Boston Celtics (1959–1966)',
        'Wilt Chamberlain anota 100 pontos contra os Knicks (02/03/1962)',
        'Bill Russell torna-se o primeiro técnico negro campeão da história das grandes ligas dos EUA (1968)',
        'Oscar Robertson fecha 1961–62 com 30.8 PPG, 12.5 RPG e 11.4 APG',
      ],
      icons: ['Bill Russell', 'Wilt Chamberlain', 'Oscar Robertson', 'Jerry West', 'Elgin Baylor'],
    },
    {
      id: 'skyhook-aba',
      period: '1970 – 1979',
      title: 'O Skyhook, Paridade & Fusão ABA',
      subtitle: 'Kareem Abdul-Jabbar, Dr. J e a contracultura criativa dos anos 70',
      accentColor: '#eab308',
      definingStat: { value: '6×', label: 'MVPs conquistados por Kareem Abdul-Jabbar' },
      summary:
        'Uma década de paridade vibrante, estilo afro, enterradas acrobáticas vindas da ABA e o arremesso mais indefensável da história.',
      fullStory:
        'Oito franquias diferentes levantaram o troféu nos anos 1970. O New York Knicks de Walt "Clyde" Frazier e Willis Reed emocionou o Madison Square Garden em 1970 e 1973; Kareem Abdul-Jabbar empilhou MVPs com seu lendário Skyhook; Bill Walton encantou com o título do Portland Trail Blazers em 1977; e a fusão com a ABA em 1976 injetou a arte aérea de Julius "Dr. J" Erving e preparou o terreno para a linha de 3 pontos em 1979.',
      milestones: [
        'Jogo 7 heroico de Willis Reed no Madison Square Garden (1970)',
        '33 vitórias consecutivas do Lakers em 1971–72 (recorde até hoje)',
        'Fusão oficial com a ABA adiciona Spurs, Nuggets, Pacers e Nets (1976)',
        'Estreia da linha de 3 pontos na temporada 1979–80',
      ],
      icons: ['Kareem Abdul-Jabbar', 'Julius Erving', 'Walt Frazier', 'Bill Walton', 'Pete Maravich'],
    },
    {
      id: 'showtime-bird',
      period: '1980 – 1989',
      title: 'Showtime vs. Celtic Pride',
      subtitle: 'A rivalidade Magic Johnson & Larry Bird que transformou a NBA em fenômeno pop',
      accentColor: '#a855f7',
      definingStat: { value: '8/10', label: 'Títulos divididos entre Lakers (5) e Celtics (3)' },
      summary:
        'Costa Oeste glamourosa contra o operário Boston Garden: a dualidade perfeita que catapultou a audiência mundial da liga.',
      fullStory:
        'Vindos da final universitária mais assistida da história (1979), Magic Johnson e Larry Bird entraram juntos na NBA e salvaram o prestígio comercial da liga sob o comissário David Stern. O contra-ataque hipnótico do Showtime Lakers (5 títulos nos anos 80) enfrentou o basquete cerebral e implacável dos Celtics de Bird, McHale e Parish (3 títulos) em três Finais lendárias, antes dos "Bad Boys" do Detroit Pistons imporem sua muralha física no fim da década.',
      milestones: [
        'Magic Johnson, calouro, joga de pivô no Jogo 6 das Finais de 1980 (42 PTS, 15 REB, 7 AST)',
        'Larry Bird conquista 3 MVPs consecutivos (1984, 1985, 1986)',
        'Michael Jordan anota 63 pontos no Boston Garden nos Playoffs de 1986 ("Deus disfarçado de Michael Jordan")',
        'Bicampeonato físico dos Bad Boys de Detroit (1989, 1990)',
      ],
      icons: ['Magic Johnson', 'Larry Bird', 'Isiah Thomas', 'Moses Malone', 'Dominique Wilkins'],
    },
    {
      id: 'air-jordan',
      period: '1990 – 1998',
      title: 'Sua Majestade Air Jordan & Império Global',
      subtitle: 'Dois Three-Peats perfeitos (6–0 em Finais) e o impacto cultural planetário',
      accentColor: '#ef4444',
      definingStat: { value: '72–10', label: 'Campanha lendária do Chicago Bulls em 1995–96' },
      summary:
        'Michael Jordan, Scottie Pippen e o Triângulo Ofensivo de Phil Jackson elevaram a excelência competitiva ao status de mito.',
      fullStory:
        'Nos anos 90, o número 23 de Chicago tornou-se o atleta mais reconhecido da Terra. Com dez títulos de cestinha, seis títulos da NBA e seis prêmios de MVP das Finais sem jamais permitir um Jogo 7 sequer nas Finais, Jordan definiu o conceito de "clutch" — culminando no "Last Shot" em Utah em 1998. No intervalo de sua primeira aposentadoria, Hakeem "The Dream" Olajuwon brilhou com um bicampeonato magistral pelo Houston Rockets (1994–95).',
      milestones: [
        'Primeiro Three-Peat dos Bulls (1991, 1992, 1993)',
        'Dream Team conquista o ouro olímpico em Barcelona (1992)',
        'Bicampeonato de Hakeem Olajuwon pelo Houston Rockets (1994, 1995)',
        'Segundo Three-Peat dos Bulls (1996, 1997, 1998) com 72 vitórias em 95–96',
      ],
      icons: ['Michael Jordan', 'Scottie Pippen', 'Hakeem Olajuwon', 'Karl Malone', 'Charles Barkley'],
    },
    {
      id: 'mamba-spurs',
      period: '1999 – 2010',
      title: 'Shaq & Kobe, Dinastia Spurs & Mamba Mentality',
      subtitle: 'Força bruta no garrafão, maestria coletiva no Texas e ícones culturais',
      accentColor: '#f59e0b',
      definingStat: { value: '81 PTS', label: 'Obra-prima de Kobe Bryant em 22/01/2006' },
      summary:
        'A última dupla a conquistar um Three-Peat dividiu a década com a perfeição tática de Tim Duncan e a obsessão competitiva de Kobe Bryant.',
      fullStory:
        'Shaquille O’Neal, no auge físico mais avassalador da era moderna, uniu-se ao jovem prodígio Kobe Bryant para varrer a liga com três títulos seguidos (2000–2002). Enquanto Allen Iverson revolucionava a estética urbana e o drible (crossover), o San Antonio Spurs de Tim Duncan, Manu Ginóbili, Tony Parker e Gregg Popovich construía uma clínica de longevidade. No fim da década, Kobe consolidou a "Mamba Mentality" com mais dois anéis (2009, 2010), superando o Big Three de Boston em um épico Jogo 7.',
      milestones: [
        'Three-Peat do Los Angeles Lakers de Shaq & Kobe (2000, 2001, 2002)',
        'Detroit Pistons de 2004 vence sem superestrelas com defesa histórica',
        'Kobe Bryant marca 81 pontos contra o Toronto Raptors (2006)',
        'Celtics (Garnett, Pierce, Allen) vs. Lakers reacende a maior rivalidade em 2008 e 2010',
      ],
      icons: ['Kobe Bryant', "Shaquille O'Neal", 'Tim Duncan', 'Allen Iverson', 'Dirk Nowitzki', 'Kevin Garnett'],
    },
    {
      id: 'king-splash',
      period: '2011 – 2019',
      title: 'King James & A Revolução de Stephen Curry',
      subtitle: 'Oito Finais seguidas de LeBron colidem com a geometria infinita do Golden State Warriors',
      accentColor: '#3b82f6',
      definingStat: { value: '73–9', label: 'Recorde histórico de vitórias dos Warriors em 2015–16' },
      summary:
        'A década em que a matemática, o arremesso de 9 metros e o "positionless basketball" redesenharam todas as quadras do mundo.',
      fullStory:
        'Após o título heroico de Dirk Nowitzki em 2011, LeBron James dominou o Leste alcançando 8 Finais consecutivas (Miami e Cleveland). Do Oeste emergiu Stephen Curry: primeiro MVP unânime da história (2016), quebrando o próprio recorde com 402 bolas de 3 em uma única temporada. Cavaliers e Warriors protagonizaram quatro Finais seguidas (2015–2018), incluindo a única virada de 3–1 da história das Finais em 2016 (com "The Block" de LeBron) e a chegada de Kevin Durant à Bay Area.',
      milestones: [
        'Bicampeonato do Miami Heat Big Three (LeBron, Wade, Bosh — 2012, 2013)',
        'Spurs de 2014 apresenta o "Beautiful Game" coletivo nas Finais',
        'Cavaliers vira 3–1 contra o Warriors 73–9 no Jogo 7 de 2016',
        'Stephen Curry muda para sempre o volume de 3 pontos em todos os níveis do esporte',
      ],
      icons: ['LeBron James', 'Stephen Curry', 'Kevin Durant', 'Kawhi Leonard', 'Dwyane Wade', 'James Harden'],
    },
    {
      id: 'global-parity',
      period: '2020 – Presente',
      title: 'Era Sem Fronteiras & Paridade Total',
      subtitle: 'Superestrelas internacionais, unicórnios de 2,24m e sete campeões inéditos seguidos',
      accentColor: '#f97316',
      definingStat: { value: '40.000+', label: 'Pontos na carreira alcançados por LeBron James' },
      summary:
        'O talento mundial assumiu o centro do palco enquanto a liga vive o período mais equilibrado e imprevisível de seus 80 anos.',
      fullStory:
        'Da histórica Bolha de Orlando em 2020 (17º título dos Lakers) ao recordista 18º banner do Boston Celtics em 2024 e a consagração de novas potências jovens, a NBA tornou-se verdadeiramente planetária. Nikola Jokić (Sérvia) reinventou a posição de pivô como maestro de triple-doubles, Giannis Antetokounmpo (Grécia) anotou 50 pontos para fechar as Finais de 2021, LeBron ultrapassou a barreira mítica dos 40 mil pontos, Luka Dončić e Shai Gilgeous-Alexander dominam as tabelas de pontuação e Victor Wembanyama inaugura uma nova dimensão física.',
      milestones: [
        'Giannis Antetokounmpo faz 50 pontos no Jogo 6 das Finais de 2021 pelos Bucks',
        'Stephen Curry torna-se o maior arremessador de 3 pontos da história e vence o 4º anel (2022)',
        'Nikola Jokić conquista 3 MVPs em 4 anos e leva o Denver Nuggets ao 1º título (2023)',
        'LeBron James quebra o recorde de Kareem (38.387) e inaugura o clube dos 40.000 pontos',
        'Boston Celtics conquista o 18º título histórico da franquia (2024)',
      ],
      icons: ['Nikola Jokić', 'Giannis Antetokounmpo', 'Luka Dončić', 'Shai Gilgeous-Alexander', 'Jayson Tatum', 'Victor Wembanyama'],
    },
  ] as NbaEra[],

  legends: [
    {
      id: 'jordan',
      name: 'Michael Jordan',
      nickname: 'His Airness / Air Jordan',
      era: '1984 – 2003',
      jersey: '23',
      position: 'SG',
      primaryTeam: 'Chicago Bulls',
      teamAbbreviation: 'CHI',
      teamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/chi.png',
      accentColor: '#ce1141',
      titles: 6,
      mvps: 5,
      finalsMvps: 6,
      allStars: 14,
      stats: { ppg: '30.1', rpg: '6.2', apg: '5.3' },
      signatureMove: 'Fadeaway Jumper no Mid-Range',
      quote: 'Eu errei mais de 9.000 arremessos na minha carreira. Falhei repetidas vezes — e é por isso que eu venço.',
      bio: 'Dono da maior média de pontos por jogo da história da temporada regular (30.1) e dos Playoffs (33.4), invicto em 6 Finais da NBA e 10 vezes cestinha da liga.',
    },
    {
      id: 'lebron',
      name: 'LeBron James',
      nickname: 'King James',
      era: '2003 – Presente',
      jersey: '23',
      position: 'SF',
      primaryTeam: 'Cavaliers • Heat • Lakers',
      teamAbbreviation: 'LAL',
      teamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/lal.png',
      headshot: 'https://a.espncdn.com/i/headshots/nba/players/full/1966.png',
      accentColor: '#fdb927',
      titles: 4,
      mvps: 4,
      finalsMvps: 4,
      allStars: 21,
      stats: { ppg: '27.0', rpg: '7.5', apg: '7.4' },
      signatureMove: 'Tomahawk Dunk & Chase-Down Block',
      quote: 'Nada é dado. Tudo é conquistado.',
      bio: 'Maior pontuador de todos os tempos da NBA (40.000+ pontos e único no clube 40K/10K/10K), campeão e MVP das Finais por três franquias diferentes.',
    },
    {
      id: 'kareem',
      name: 'Kareem Abdul-Jabbar',
      nickname: 'The Captain',
      era: '1969 – 1989',
      jersey: '33',
      position: 'C',
      primaryTeam: 'Milwaukee Bucks • LA Lakers',
      teamAbbreviation: 'LAL',
      teamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/lal.png',
      accentColor: '#8b5cf6',
      titles: 6,
      mvps: 6,
      finalsMvps: 2,
      allStars: 19,
      stats: { ppg: '24.6', rpg: '11.2', apg: '3.6' },
      signatureMove: 'The Skyhook (Gancho Celestial)',
      quote: 'Um jogador pode ser crucial para um time, mas um jogador sozinho não faz um time vencedor.',
      bio: 'Recordista absoluto de prêmios de MVP da temporada regular (6), dono de duas décadas inteiras de excelência e do arremesso mais letal já criado.',
    },
    {
      id: 'russell',
      name: 'Bill Russell',
      nickname: 'The Ultimate Winner',
      era: '1956 – 1969',
      jersey: '6',
      position: 'C',
      primaryTeam: 'Boston Celtics',
      teamAbbreviation: 'BOS',
      teamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/bos.png',
      accentColor: '#007a33',
      titles: 11,
      mvps: 5,
      finalsMvps: 0,
      allStars: 12,
      stats: { ppg: '15.1', rpg: '22.5', apg: '4.3' },
      signatureMove: 'Tocos mantidos em posse para iniciar contra-ataque',
      quote: 'A concentração e a força mental são as margens da vitória.',
      bio: '11 títulos em 13 temporadas (10–0 em Jogos 7). Seu número 6 é o único aposentado em todas as 30 franquias da NBA, e o troféu de MVP das Finais leva seu nome.',
    },
    {
      id: 'kobe',
      name: 'Kobe Bryant',
      nickname: 'Black Mamba',
      era: '1996 – 2016',
      jersey: '8 / 24',
      position: 'SG',
      primaryTeam: 'Los Angeles Lakers',
      teamAbbreviation: 'LAL',
      teamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/lal.png',
      accentColor: '#a855f7',
      titles: 5,
      mvps: 1,
      finalsMvps: 2,
      allStars: 18,
      stats: { ppg: '25.0', rpg: '5.2', apg: '4.7' },
      signatureMove: 'Footwork de Post-Up & Turnaround Fadeaway',
      quote: 'Mamba Mentality significa tentar constantemente ser a melhor versão de si mesmo.',
      bio: '20 temporadas vestindo ouro e roxo, duas camisas aposentadas (8 e 24), jogo histórico de 81 pontos e 60 pontos em sua noite de despedida.',
    },
    {
      id: 'curry',
      name: 'Stephen Curry',
      nickname: 'Chef Curry',
      era: '2009 – Presente',
      jersey: '30',
      position: 'PG',
      primaryTeam: 'Golden State Warriors',
      teamAbbreviation: 'GSW',
      teamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/gs.png',
      headshot: 'https://a.espncdn.com/i/headshots/nba/players/full/3975.png',
      accentColor: '#1d428a',
      titles: 4,
      mvps: 2,
      finalsMvps: 1,
      allStars: 11,
      stats: { ppg: '24.7', rpg: '4.7', apg: '6.4' },
      signatureMove: 'Pull-Up 3 do Logo & Movimento Off-Ball',
      quote: 'Seja a melhor versão de você mesmo em qualquer coisa que fizer.',
      bio: 'Maior arremessador da história do basquete (4.000+ bolas de 3 na carreira), único MVP unânime da NBA (2016) e arquiteto da dinastia do Golden State Warriors.',
    },
    {
      id: 'magic',
      name: 'Magic Johnson',
      nickname: 'Magic',
      era: '1979 – 1996',
      jersey: '32',
      position: 'PG',
      primaryTeam: 'Los Angeles Lakers',
      teamAbbreviation: 'LAL',
      teamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/lal.png',
      accentColor: '#eab308',
      titles: 5,
      mvps: 3,
      finalsMvps: 3,
      allStars: 12,
      stats: { ppg: '19.5', rpg: '7.2', apg: '11.2' },
      signatureMove: 'Passe No-Look no Contra-Ataque Showtime',
      quote: 'Não pergunte o que seus companheiros podem fazer por você. Pergunte o que você pode fazer por eles.',
      bio: 'Armador de 2,06m com a maior média de assistências por jogo da história da NBA (11.2 APG) e maestro da era Showtime em Los Angeles.',
    },
    {
      id: 'bird',
      name: 'Larry Bird',
      nickname: 'Larry Legend',
      era: '1979 – 1992',
      jersey: '33',
      position: 'SF',
      primaryTeam: 'Boston Celtics',
      teamAbbreviation: 'BOS',
      teamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/bos.png',
      accentColor: '#16a34a',
      titles: 3,
      mvps: 3,
      finalsMvps: 2,
      allStars: 12,
      stats: { ppg: '24.3', rpg: '10.0', apg: '6.3' },
      signatureMove: 'Step-Back Clutch Jumper & Passes de Toque Único',
      quote: 'Primeiro domine os fundamentos.',
      bio: 'Tricampeão consecutivo do prêmio de MVP (1984–86), membro original do clube 50-40-90 e ícone máximo da genialidade competitiva de Boston.',
    },
    {
      id: 'wilt',
      name: 'Wilt Chamberlain',
      nickname: 'Wilt the Stilt / The Big Dipper',
      era: '1959 – 1973',
      jersey: '13',
      position: 'C',
      primaryTeam: 'Warriors • 76ers • Lakers',
      teamAbbreviation: 'PHI',
      teamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/phi.png',
      accentColor: '#2563eb',
      titles: 2,
      mvps: 4,
      finalsMvps: 1,
      allStars: 13,
      stats: { ppg: '30.1', rpg: '22.9', apg: '4.4' },
      signatureMove: 'Finger Roll & Fadeaway Bank Shot',
      quote: 'Dizem que ninguém é perfeito. Aí dizem que a prática leva à perfeição. Eu gostaria que se decidissem.',
      bio: 'Detentor de mais de 70 recordes individuais da NBA, incluindo 100 pontos num jogo, 55 rebotes numa partida e média de 50.4 pontos por jogo em 1961–62.',
    },
    {
      id: 'duncan',
      name: 'Tim Duncan',
      nickname: 'The Big Fundamental',
      era: '1997 – 2016',
      jersey: '21',
      position: 'PF',
      primaryTeam: 'San Antonio Spurs',
      teamAbbreviation: 'SAS',
      teamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/sa.png',
      accentColor: '#94a3b8',
      titles: 5,
      mvps: 2,
      finalsMvps: 3,
      allStars: 15,
      stats: { ppg: '19.0', rpg: '10.8', apg: '3.0' },
      signatureMove: 'Arremesso de Tabela (45° Bank Shot)',
      quote: 'Bom, melhor, o melhor. Nunca descanse até que o seu bom seja melhor e o seu melhor seja o máximo.',
      bio: 'Único jogador na história a ser titular campeão da NBA em três décadas diferentes, somando mais de 70% de vitórias ao longo de 19 temporadas em San Antonio.',
    },
    {
      id: 'shaq',
      name: "Shaquille O'Neal",
      nickname: 'Diesel / Superman',
      era: '1992 – 2011',
      jersey: '34',
      position: 'C',
      primaryTeam: 'Magic • Lakers • Heat',
      teamAbbreviation: 'LAL',
      teamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/lal.png',
      accentColor: '#f59e0b',
      titles: 4,
      mvps: 1,
      finalsMvps: 3,
      allStars: 15,
      stats: { ppg: '23.7', rpg: '10.9', apg: '2.5' },
      signatureMove: 'Black Tornado Spin & Enterrada Destruidora de Tabelas',
      quote: 'Excelência não é um ato isolado, mas um hábito.',
      bio: 'A força física mais imparável que já pisou no garrafão, obrigando a NBA a reforçar a engenharia das tabelas de vidro e vencendo 3 Finals MVPs seguidos.',
    },
    {
      id: 'jokic',
      name: 'Nikola Jokić',
      nickname: 'The Joker',
      era: '2015 – Presente',
      jersey: '15',
      position: 'C',
      primaryTeam: 'Denver Nuggets',
      teamAbbreviation: 'DEN',
      teamLogo: 'https://a.espncdn.com/i/teamlogos/nba/500/den.png',
      headshot: 'https://a.espncdn.com/i/headshots/nba/players/full/3112335.png',
      accentColor: '#fec524',
      titles: 1,
      mvps: 3,
      finalsMvps: 1,
      allStars: 7,
      stats: { ppg: '21.6', rpg: '10.9', apg: '7.1' },
      signatureMove: 'Sombor Shuffle & Passes Touchdown de Quadra Inteira',
      quote: 'O basquete é simples quando todos tocam na bola com alegria.',
      bio: 'Escolhido na 41ª posição do Draft durante um comercial de TV, transformou-se em tricampeão de MVP e no pivô passador mais genial da história do basquete.',
    },
  ] as NbaLegend[],

  dynasties: [
    {
      id: 'celtics',
      franchise: 'Boston Celtics',
      abbreviation: 'BOS',
      logo: 'https://a.espncdn.com/i/teamlogos/nba/500/bos.png',
      color: '#007a33',
      titles: 18,
      years: [
        '1957', '1959', '1960', '1961', '1962', '1963', '1964', '1965', '1966',
        '1968', '1969', '1974', '1976', '1981', '1984', '1986', '2008', '2024',
      ],
      definingLegends: ['Bill Russell', 'Larry Bird', 'John Havlicek', 'Paul Pierce', 'Jayson Tatum'],
      legacy: 'Franquia mais vitoriosa da NBA, célebre pelo piso parquet do TD Garden e pelas 18 flâmulas erguidas no teto.',
    },
    {
      id: 'lakers',
      franchise: 'Los Angeles Lakers',
      abbreviation: 'LAL',
      logo: 'https://a.espncdn.com/i/teamlogos/nba/500/lal.png',
      color: '#fdb927',
      titles: 17,
      years: [
        '1949', '1950', '1952', '1953', '1954', '1972', '1980', '1982', '1985',
        '1987', '1988', '2000', '2001', '2002', '2009', '2010', '2020',
      ],
      definingLegends: ['Magic Johnson', 'Kobe Bryant', 'Kareem Abdul-Jabbar', "Shaquille O'Neal", 'Jerry West', 'LeBron James'],
      legacy: 'Sinônimo de estrelato hollywoodiano, Showtime e 33 aparições nas Finais da NBA (recorde absoluto da liga).',
    },
    {
      id: 'warriors',
      franchise: 'Golden State Warriors',
      abbreviation: 'GSW',
      logo: 'https://a.espncdn.com/i/teamlogos/nba/500/gs.png',
      color: '#1d428a',
      titles: 7,
      years: ['1947', '1956', '1975', '2015', '2017', '2018', '2022'],
      definingLegends: ['Stephen Curry', 'Klay Thompson', 'Draymond Green', 'Kevin Durant', 'Rick Barry', 'Wilt Chamberlain'],
      legacy: 'Vencedora do primeiro campeonato de 1947 (em Filadélfia) e protagonista da revolução moderna de 3 pontos.',
    },
    {
      id: 'bulls',
      franchise: 'Chicago Bulls',
      abbreviation: 'CHI',
      logo: 'https://a.espncdn.com/i/teamlogos/nba/500/chi.png',
      color: '#ce1141',
      titles: 6,
      years: ['1991', '1992', '1993', '1996', '1997', '1998'],
      definingLegends: ['Michael Jordan', 'Scottie Pippen', 'Dennis Rodman', 'Derrick Rose'],
      legacy: 'Invicta em Finais da NBA (6–0), autora de dois Three-Peats nos anos 90 e eternizada pela música de entrada de Alan Parsons Project.',
    },
    {
      id: 'spurs',
      franchise: 'San Antonio Spurs',
      abbreviation: 'SAS',
      logo: 'https://a.espncdn.com/i/teamlogos/nba/500/sa.png',
      color: '#c4ced4',
      titles: 5,
      years: ['1999', '2003', '2005', '2007', '2014'],
      definingLegends: ['Tim Duncan', 'David Robinson', 'Manu Ginóbili', 'Tony Parker', 'Kawhi Leonard', 'Victor Wembanyama'],
      legacy: 'Padrão-ouro de gestão, cultura coletiva e desenvolvimento internacional sob o comando histórico de Gregg Popovich.',
    },
    {
      id: 'heat',
      franchise: 'Miami Heat',
      abbreviation: 'MIA',
      logo: 'https://a.espncdn.com/i/teamlogos/nba/500/mia.png',
      color: '#98002e',
      titles: 3,
      years: ['2006', '2012', '2013'],
      definingLegends: ['Dwyane Wade', 'LeBron James', 'Chris Bosh', "Shaquille O'Neal", 'Alonzo Mourning'],
      legacy: 'A célebre "Heat Culture" forjada por Pat Riley e Erik Spoelstra, com 7 participações nas Finais desde 2006.',
    },
  ] as NbaDynasty[],

  records: [
    {
      id: 'wilt-100',
      category: 'Jogo Único',
      value: '100 PTS',
      title: 'Maior Pontuação Individual em um Jogo',
      holder: 'Wilt Chamberlain',
      team: 'Philadelphia Warriors',
      dateOrSpan: '2 de Março de 1962',
      context: 'Contra o NY Knicks em Hershey (169–147), convertendo 36 de 63 arremessos de quadra e 28 de 32 lances livres.',
    },
    {
      id: 'lebron-40k',
      category: 'Carreira',
      value: '40.000+ PTS',
      title: 'Maior Pontuador da História da NBA',
      holder: 'LeBron James',
      team: 'CAVS • MIA • LAL',
      dateOrSpan: '2003 – Presente',
      context: 'Ultrapassou os 38.387 pontos de Kareem Abdul-Jabbar em fevereiro de 2023 e inaugurou sozinho a marca de 40 mil pontos.',
    },
    {
      id: 'russell-11',
      category: 'Carreira',
      value: '11 Anéis',
      title: 'Mais Títulos Conquistados como Jogador',
      holder: 'Bill Russell',
      team: 'Boston Celtics',
      dateOrSpan: '1957 – 1969',
      context: 'Venceu 11 campeonatos em apenas 13 anos de carreira — mais títulos do que qualquer franquia exceto Celtics e Lakers.',
    },
    {
      id: 'warriors-73',
      category: 'Franquia',
      value: '73 – 9',
      title: 'Melhor Campanha da Temporada Regular',
      holder: 'Golden State Warriors',
      team: 'Temporada 2015–16',
      dateOrSpan: '89,0% de aproveitamento',
      context: 'Superou o mítico 72–10 do Chicago Bulls de 1995–96 após abrir a temporada com 24 vitórias consecutivas.',
    },
    {
      id: 'curry-402',
      category: 'Temporada',
      value: '402 3PM',
      title: 'Mais Bolas de 3 Pontos em uma Temporada',
      holder: 'Stephen Curry',
      team: 'Golden State Warriors',
      dateOrSpan: 'Temporada 2015–16',
      context: 'Quebrou a barreira das 400 bolas triplas convertendo impressionantes 45,4% de aproveitamento no perímetro.',
    },
    {
      id: 'lakers-33',
      category: 'Franquia',
      value: '33 Vitórias',
      title: 'Maior Sequência Invicta da História',
      holder: 'Los Angeles Lakers',
      team: 'Temporada 1971–72',
      dateOrSpan: 'Nov 1971 – Jan 1972',
      context: 'Liderado por Jerry West, Wilt Chamberlain e Gail Goodrich, ficou mais de dois meses inteiros sem perder um jogo.',
    },
    {
      id: 'wilt-504',
      category: 'Temporada',
      value: '50.4 PPG',
      title: 'Maior Média de Pontos em uma Temporada',
      holder: 'Wilt Chamberlain',
      team: 'Philadelphia Warriors',
      dateOrSpan: 'Temporada 1961–62',
      context: 'Na mesma temporada, Wilt teve média de 48,5 minutos por jogo (atuando até nas prorrogações sem descansar!).',
    },
    {
      id: 'skiles-30',
      category: 'Jogo Único',
      value: '30 AST',
      title: 'Mais Assistências em uma Única Partida',
      holder: 'Scott Skiles',
      team: 'Orlando Magic',
      dateOrSpan: '30 de Dezembro de 1990',
      context: 'Distribuiu 30 passes decisivos na vitória de 155–116 do Orlando Magic sobre o Denver Nuggets.',
    },
  ] as NbaRecord[],

  trivia: [
    {
      id: 'q1',
      question: 'Qual jogador inspirou a silhueta oficial do logotipo da NBA criado em 1969?',
      options: ['Michael Jordan', 'Jerry West', 'Julius "Dr. J" Erving', 'Bob Cousy'],
      correctIndex: 1,
      explanation: 'O designer Alan Siegel utilizou uma fotografia de Jerry West, lenda do Los Angeles Lakers apelidado de "The Logo", conduzindo a bola.',
    },
    {
      id: 'q2',
      question: 'Qual foi a única equipe na história a reverter uma desvantagem de 3 a 1 nas Finais da NBA?',
      options: ['Boston Celtics (2008)', 'Miami Heat (2013)', 'Cleveland Cavaliers (2016)', 'Chicago Bulls (1998)'],
      correctIndex: 2,
      explanation: 'Em 2016, LeBron James e Kyrie Irving lideraram o Cleveland Cavaliers para vencer os Jogos 5, 6 e 7 contra o Golden State Warriors de 73 vitórias.',
    },
    {
      id: 'q3',
      question: 'Quantos pontos Wilt Chamberlain marcou em sua partida recorde de 2 de março de 1962?',
      options: ['81 pontos', '92 pontos', '100 pontos', '105 pontos'],
      correctIndex: 2,
      explanation: 'Wilt anotou exatos 100 pontos pelo Philadelphia Warriors contra o New York Knicks em Hershey, Pensilvânia — a maior marca individual da história.',
    },
    {
      id: 'q4',
      question: 'Qual franquia detém isoladamente o recorde de mais títulos da NBA?',
      options: ['Los Angeles Lakers', 'Boston Celtics', 'Chicago Bulls', 'Golden State Warriors'],
      correctIndex: 1,
      explanation: 'Com a conquista de 2024, o Boston Celtics chegou a 18 títulos da NBA, superando os 17 troféus do rival Los Angeles Lakers.',
    },
    {
      id: 'q5',
      question: 'Em que ano o relógio de posse de 24 segundos foi introduzido, revolucionando o ritmo da NBA?',
      options: ['1946', '1954', '1967', '1979'],
      correctIndex: 1,
      explanation: 'Idealizado por Danny Biasone (dono do Syracuse Nationals) em 1954, o relógio de 24 segundos eliminou a cera e salvou a atratividade da NBA.',
    },
  ] as NbaTriviaQuestion[],
};
