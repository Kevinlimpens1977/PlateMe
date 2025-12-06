export interface DishWithScore {
  id: string
  name: string
  category: 'voor' | 'hoofd' | 'na'
  subtitle: string
  ingredients: string
  preparation: string
  image_url: string
  score: number
  created_at: string
}

export interface TournamentMatch {
  dish1: DishWithScore
  dish2: DishWithScore
  winner: DishWithScore
}

export interface TournamentResult {
  rankedDishes: DishWithScore[]
  matches: TournamentMatch[]
}

export function runTournament(dishes: DishWithScore[]): TournamentResult {
  if (dishes.length === 0) {
    return { rankedDishes: [], matches: [] }
  }

  if (dishes.length === 1) {
    return { rankedDishes: dishes, matches: [] }
  }

  const matches: TournamentMatch[] = []
  let currentRound = [...dishes]

  // Continue tournament until we have a complete ranking
  while (currentRound.length > 1) {
    const nextRound: DishWithScore[] = []
    
    // Pair up dishes for matches
    for (let i = 0; i < currentRound.length; i += 2) {
      if (i + 1 < currentRound.length) {
        // Create a match between two dishes
        const dish1 = currentRound[i]
        const dish2 = currentRound[i + 1]
        
        // For now, randomly select a winner (in real app, user would choose)
        const winner = Math.random() > 0.5 ? dish1 : dish2
        
        matches.push({
          dish1,
          dish2,
          winner
        })
        
        nextRound.push(winner)
      } else {
        // Odd number of dishes, the last one gets a bye
        nextRound.push(currentRound[i])
      }
    }
    
    currentRound = nextRound
  }

  // Create final ranking based on tournament performance
  const rankedDishes = createRankingFromMatches(dishes, matches)
  
  return { rankedDishes, matches }
}

function createRankingFromMatches(dishes: DishWithScore[], matches: TournamentMatch[]): DishWithScore[] {
  // Count wins for each dish
  const winCounts = new Map<string, number>()
  
  dishes.forEach(dish => {
    winCounts.set(dish.id, 0)
  })
  
  matches.forEach(match => {
    const currentWins = winCounts.get(match.winner.id) || 0
    winCounts.set(match.winner.id, currentWins + 1)
  })
  
  // Sort dishes by wins, then by original score
  return dishes.sort((a, b) => {
    const aWins = winCounts.get(a.id) || 0
    const bWins = winCounts.get(b.id) || 0
    
    if (bWins !== aWins) {
      return bWins - aWins
    }
    
    return b.score - a.score
  })
}

export function getTop3(tournamentResult: TournamentResult): DishWithScore[] {
  return tournamentResult.rankedDishes.slice(0, 3)
}

export function selectWinner(top3: DishWithScore[], selectedIndex: number): DishWithScore {
  if (selectedIndex < 0 || selectedIndex >= top3.length) {
    throw new Error('Invalid selection')
  }
  return top3[selectedIndex]
}