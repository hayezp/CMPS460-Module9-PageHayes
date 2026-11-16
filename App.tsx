
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import teamsData from './data/teams.json';

type Player = {
  name: string;
  position: string;
  number: number;
};

type Team = {
  id: string;
  name: string;
  city: string;
  conference: string;
  players: Player[];
};

const STORAGE_KEY = 'nfl_favorite_teams';

const teams: Team[] = teamsData;

export default function App() {
  const [search, setSearch] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [showFavorites, setShowFavorites] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [storageError, setStorageError] = useState('');

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);

        if (saved !== null) {
          const parsed: unknown = JSON.parse(saved);

          if (
            Array.isArray(parsed) &&
            parsed.every((id) => typeof id === 'string')
          ) {
            setFavorites(parsed);
          }
        }
      } catch (error) {
        setStorageError('Could not load saved favorites.');
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, []);

  const toggleFavorite = async (teamId: string) => {
    const updated = favorites.includes(teamId)
      ? favorites.filter((id) => id !== teamId)
      : [...favorites, teamId];

    try {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updated)
      );

      setFavorites(updated);
      setStorageError('');
    } catch (error) {
      setStorageError(
        'Could not save favorites. Please try again.'
      );
    }
  };

  const filteredTeams = teams.filter((team) => {
    const matchesSearch = `${team.city} ${team.name}`
      .toLowerCase()
      .includes(search.trim().toLowerCase());

    const matchesFavorites =
      !showFavorites || favorites.includes(team.id);

    return matchesSearch && matchesFavorites;
  });

  const renderFavoriteButton = (team: Team) => {
    const isFavorite = favorites.includes(team.id);

    return (
      <TouchableOpacity
        style={[
          styles.favoriteButton,
          isFavorite && styles.favoriteButtonActive,
        ]}
        onPress={() => toggleFavorite(team.id)}
        accessibilityRole="button"
        accessibilityLabel={
          isFavorite
            ? `Remove ${team.city} ${team.name} from favorites`
            : `Add ${team.city} ${team.name} to favorites`
        }
      >
        <Text
          style={[
            styles.favoriteText,
            isFavorite && styles.favoriteTextActive,
          ]}
        >
          {isFavorite ? '★ Favorited' : '☆ Add Favorite'}
        </Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#1e3a8a" />
        <Text style={styles.emptyText}>
          Loading favorites...
        </Text>
      </SafeAreaView>
    );
  }

  if (selectedTeam) {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setSelectedTeam(null)}
          accessibilityRole="button"
          accessibilityLabel="Back to teams"
        >
          <Text style={styles.backButtonText}>
            ← Back to Teams
          </Text>
        </TouchableOpacity>

        <Text style={styles.title}>
          {selectedTeam.city} {selectedTeam.name}
        </Text>

        <Text style={styles.subtitle}>
          Conference: {selectedTeam.conference}
        </Text>

        {renderFavoriteButton(selectedTeam)}

        {storageError ? (
          <Text style={styles.errorText}>
            {storageError}
          </Text>
        ) : null}

        <Text style={styles.sectionTitle}>
          Sample Players
        </Text>

        <FlatList
          data={selectedTeam.players}
          keyExtractor={(item) => item.number.toString()}
          renderItem={({ item }) => (
            <View style={styles.playerCard}>
              <Text style={styles.teamName}>
                {item.name}
              </Text>

              <Text style={styles.teamInfo}>
                Position: {item.position}
              </Text>

              <Text style={styles.teamInfo}>
                Jersey Number: #{item.number}
              </Text>
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>
        NFL Teams
      </Text>

      <Text style={styles.subtitle}>
        Find teams, view players, and save your favorites!
      </Text>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[
            styles.tab,
            !showFavorites && styles.activeTab,
          ]}
          onPress={() => setShowFavorites(false)}
          accessibilityRole="button"
          accessibilityLabel="Show all teams"
        >
          <Text
            style={[
              styles.tabText,
              !showFavorites && styles.activeTabText,
            ]}
          >
            All Teams
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            showFavorites && styles.activeTab,
          ]}
          onPress={() => setShowFavorites(true)}
          accessibilityRole="button"
          accessibilityLabel="Show favorite teams"
        >
          <Text
            style={[
              styles.tabText,
              showFavorites && styles.activeTabText,
            ]}
          >
            Favorites ({favorites.length})
          </Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Search by team or city..."
        value={search}
        onChangeText={setSearch}
        autoCapitalize="none"
      />

      {storageError ? (
        <Text style={styles.errorText}>
          {storageError}
        </Text>
      ) : null}

      <FlatList
        data={filteredTeams}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.teamCard}>
            <TouchableOpacity
              onPress={() => setSelectedTeam(item)}
              accessibilityRole="button"
              accessibilityLabel={`View ${item.city} ${item.name} players`}
            >
              <Text style={styles.teamName}>
                {item.city} {item.name}
              </Text>

              <Text style={styles.teamInfo}>
                Conference: {item.conference}
              </Text>

              <Text style={styles.viewPlayers}>
                Tap to view players →
              </Text>
            </TouchableOpacity>

            {renderFavoriteButton(item)}
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {showFavorites && favorites.length === 0
              ? 'No favorite teams yet. Add some from All Teams!'
              : 'No teams found. Try searching again!'}
          </Text>
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
    paddingTop: 45,
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 5,
  },

  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 20,
    marginBottom: 15,
  },

  tabs: {
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: '#e5e7eb',
    borderRadius: 10,
    padding: 4,
  },

  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },

  activeTab: {
    backgroundColor: '#1e3a8a',
  },

  tabText: {
    color: '#333',
    fontWeight: '600',
  },

  activeTabText: {
    color: '#fff',
  },

  searchInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    marginBottom: 20,
    color: '#222',
  },

  teamCard: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },

  playerCard: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },

  teamName: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#222',
  },

  teamInfo: {
    fontSize: 14,
    color: '#666',
    marginTop: 6,
  },

  viewPlayers: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 12,
  },

  favoriteButton: {
    borderWidth: 1,
    borderColor: '#1e3a8a',
    borderRadius: 8,
    padding: 11,
    marginTop: 14,
    alignItems: 'center',
  },

  favoriteButtonActive: {
    backgroundColor: '#1e3a8a',
  },

  favoriteText: {
    color: '#1e3a8a',
    fontWeight: '600',
  },

  favoriteTextActive: {
    color: '#fff',
  },

  backButton: {
    marginBottom: 20,
    paddingVertical: 8,
  },

  backButtonText: {
    color: '#2563eb',
    fontSize: 17,
    fontWeight: '600',
  },

  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 30,
  },

  errorText: {
    color: '#b91c1c',
    marginBottom: 12,
    fontSize: 14,
  },
});
