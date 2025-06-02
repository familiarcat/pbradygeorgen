#!/usr/bin/env bash

echo "[INFO] Running Crew Voice Test Simulation..."

# Characters and voice mappings (simple arrays for compatibility)
characters=("Spock" "Picard" "Crusher" "Riker" "Troi" "Geordi" "Worf" "Data" "OBrien" "Quark")
voices=("Alex" "Daniel" "Samantha" "Tom" "Karen" "Victoria" "Fred" "Bruce" "Ralph" "Ralph")

# Test lines per character
lines1=(
    "Captain, I find your logic... questionable."
    "There are times when men of good conscience cannot blindly follow orders."
    "His neural readings are stabilizing. We’re not out of danger, but there is hope."
    "This isn’t a drill. Let’s do what we came to do."
    "The emotional undercurrents here are... complex, but I sense no malice."
    "I’ve rerouted power through the secondary EPS manifold—try it now."
    "If it is a fight they want, I shall give them one they will not forget."
    "Curious. I am detecting fluctuations inconsistent with known parameters."
    "Transport complete. Try not to break anything this time."
    "Profit is not a dirty word, you know. Unless you’re in Starfleet."
)
lines2=(
    "Vulcan logic dictates caution in this scenario."
    "Make it so."
    "I’ll monitor him closely, Captain."
    "Let’s punch it."
    "Trust must be earned—emotions complicate that."
    "Engineering is holding steady, for now."
    "Klingons do not bluff."
    "I will require further data before forming a hypothesis."
    "Another fine day saving everyone’s backside."
    "Tell me, what’s *your* ROI on saving the galaxy?"
)

# Iterate and speak each set
for i in "${!characters[@]}"; do
    character="${characters[$i]}"
    voice="${voices[$i]}"
    line1="${lines1[$i]}"
    line2="${lines2[$i]}"

    echo "[VOICE TEST] $character → $voice"

    say -v "$voice" -r 200 "$character reporting in. $line1 $line2"
done

echo "[COMPLETE] Voice simulation test finished."
