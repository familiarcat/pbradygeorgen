"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserIntentTracker = void 0;
exports.getUserIntentTracker = getUserIntentTracker;
/**
 * UserIntentTracker - A utility for analyzing and predicting user intent based on interaction patterns
 *
 * This class tracks various user interactions (mouse movements, clicks, scrolls, etc.)
 * and provides methods to predict user intent for different UI elements.
 */
class UserIntentTracker {
    constructor() {
        // Viewport dimensions
        this.viewportWidth = 0;
        this.viewportHeight = 0;
        // Mouse position history (for velocity calculations)
        this.mousePositionHistory = [];
        this.historyLength = 10; // Number of positions to track
        // Current cursor data
        this.cursorX = 0;
        this.cursorY = 0;
        this.cursorVelocityX = 0;
        this.cursorVelocityY = 0;
        this.cursorSpeed = 0;
        this.prevCursorX = 0;
        this.prevCursorY = 0;
        // Target element position and dimensions
        this.targetX = 20;
        this.targetY = 20;
        this.targetWidth = 120;
        this.targetHeight = 40;
        this.targetCenterX = 80; // targetX + targetWidth/2
        this.targetCenterY = 40; // targetY + targetHeight/2
        this.distanceToTarget = 0;
        this.movementAlignmentWithTarget = 0;
        // Trajectory prediction
        this.projectedX = 0;
        this.projectedY = 0;
        this.projectedDistance = 0;
        this.isApproachingTarget = false;
        this.trajectoryIntersectsTarget = false;
        // Dwell time tracking
        this.dwellStartTime = 0;
        this.isDwelling = false;
        this.dwellThreshold = 0; // Dynamically calculated based on target size
        this.dwellDuration = 0;
        // Interaction metrics
        this.lastClickTimestamp = 0;
        this.lastScrollTimestamp = 0;
        this.scrollDirection = 'none';
        this.scrollAmount = 0;
        // User state detection
        this.isSelecting = false;
        this.selectionCheckInterval = null;
        this.lastSelectionCheck = 0;
        this.smallMovementCount = 0;
        this.lastActivityTimestamp = Date.now();
        this.userState = 'idle';
        // Intent confidence scores (0-100)
        this.buttonIntentScore = 0;
        this.readingIntentScore = 0;
        this.exploringIntentScore = 0;
        // Callbacks for intent changes
        this.onButtonIntentChange = null;
        // Initialize viewport dimensions
        if (typeof window !== 'undefined') {
            this.updateViewportDimensions();
            window.addEventListener('resize', this.updateViewportDimensions.bind(this));
            // Check for text selection periodically
            this.selectionCheckInterval = window.setInterval(() => {
                this.checkForTextSelection();
            }, 500);
        }
    }
    /**
     * Check if the user is selecting text
     */
    checkForTextSelection() {
        const now = Date.now();
        this.lastSelectionCheck = now;
        // Get current selection
        const selection = window.getSelection();
        const hasSelection = selection && !selection.isCollapsed && selection.toString().trim().length > 0;
        // Update selection state
        this.isSelecting = hasSelection ? true : false;
        // Update user state if selecting
        if (hasSelection) {
            this.userState = 'selecting';
            this.lastActivityTimestamp = now;
        }
        else if (this.userState === 'selecting') {
            // If we were selecting but no longer are, reset state
            this.userState = 'idle';
        }
    }
    /**
     * Update the user state based on recent activity
     */
    updateUserState() {
        const now = Date.now();
        // Don't update too frequently
        if (now - this.lastActivityTimestamp < 100)
            return;
        // Check for small movements (potential reading or precision tasks)
        const movementDistance = Math.sqrt(Math.pow(this.cursorX - this.prevCursorX, 2) +
            Math.pow(this.cursorY - this.prevCursorY, 2));
        if (movementDistance < 5) {
            this.smallMovementCount++;
        }
        else {
            this.smallMovementCount = Math.max(0, this.smallMovementCount - 1);
        }
        // Determine state based on recent activity
        if (this.isSelecting) {
            this.userState = 'selecting';
        }
        else if (now - this.lastScrollTimestamp < 500) {
            this.userState = 'scrolling';
        }
        else if (this.smallMovementCount > 5) {
            this.userState = 'reading'; // Precision movements suggest reading or detailed examination
        }
        else if (this.cursorSpeed > 500) {
            this.userState = 'navigating'; // Fast movements suggest navigation
        }
        else if (now - this.lastActivityTimestamp > 2000) {
            this.userState = 'idle';
        }
        this.lastActivityTimestamp = now;
    }
    /**
     * Get the singleton instance of UserIntentTracker
     */
    static getInstance() {
        if (!UserIntentTracker.instance) {
            UserIntentTracker.instance = new UserIntentTracker();
        }
        return UserIntentTracker.instance;
    }
    /**
     * Update the viewport dimensions
     */
    updateViewportDimensions() {
        this.viewportWidth = window.innerWidth;
        this.viewportHeight = window.innerHeight;
    }
    /**
     * Track mouse movement
     * @param event MouseEvent from the event listener
     * @param targetElement Object with target element position and dimensions
     */
    trackMouseMovement(event, targetElement) {
        // Store previous position
        this.prevCursorX = this.cursorX;
        this.prevCursorY = this.cursorY;
        // Update current cursor position
        this.cursorX = event.clientX;
        this.cursorY = event.clientY;
        // Update target element position and dimensions if provided
        if (targetElement) {
            this.targetX = targetElement.x;
            this.targetY = targetElement.y;
            // Update dimensions if provided
            if (targetElement.width !== undefined) {
                this.targetWidth = targetElement.width;
            }
            if (targetElement.height !== undefined) {
                this.targetHeight = targetElement.height;
            }
            // Use provided center or calculate it
            this.targetCenterX = targetElement.centerX !== undefined ?
                targetElement.centerX :
                this.targetX + (this.targetWidth / 2);
            this.targetCenterY = targetElement.centerY !== undefined ?
                targetElement.centerY :
                this.targetY + (this.targetHeight / 2);
            // Update dwell threshold based on target size
            this.dwellThreshold = Math.max(this.targetWidth, this.targetHeight) * 0.75;
        }
        // Add to position history
        const now = Date.now();
        this.mousePositionHistory.push({
            x: event.clientX,
            y: event.clientY,
            timestamp: now
        });
        // Limit history length
        if (this.mousePositionHistory.length > this.historyLength) {
            this.mousePositionHistory.shift();
        }
        // Calculate velocity if we have enough history
        if (this.mousePositionHistory.length >= 2) {
            const oldest = this.mousePositionHistory[0];
            const timeElapsed = (now - oldest.timestamp) / 1000; // in seconds
            if (timeElapsed > 0) {
                this.cursorVelocityX = (event.clientX - oldest.x) / timeElapsed;
                this.cursorVelocityY = (event.clientY - oldest.y) / timeElapsed;
                this.cursorSpeed = Math.sqrt(Math.pow(this.cursorVelocityX, 2) +
                    Math.pow(this.cursorVelocityY, 2));
            }
        }
        // Calculate distance to target center
        this.distanceToTarget = Math.sqrt(Math.pow(this.cursorX - this.targetCenterX, 2) +
            Math.pow(this.cursorY - this.targetCenterY, 2));
        // Calculate vector alignment with target
        // This measures how directly the cursor is moving toward the target
        const vectorToTargetX = this.targetCenterX - this.cursorX;
        const vectorToTargetY = this.targetCenterY - this.cursorY;
        const vectorToTargetLength = Math.sqrt(Math.pow(vectorToTargetX, 2) +
            Math.pow(vectorToTargetY, 2));
        // Calculate dot product to get alignment (-1 to 1, where 1 is perfect alignment)
        if (vectorToTargetLength > 0 && this.cursorSpeed > 0) {
            const normalizedVectorX = vectorToTargetX / vectorToTargetLength;
            const normalizedVectorY = vectorToTargetY / vectorToTargetLength;
            const normalizedVelocityX = this.cursorVelocityX / this.cursorSpeed;
            const normalizedVelocityY = this.cursorVelocityY / this.cursorSpeed;
            this.movementAlignmentWithTarget = (normalizedVectorX * normalizedVelocityX +
                normalizedVectorY * normalizedVelocityY);
        }
        else {
            this.movementAlignmentWithTarget = 0;
        }
        // Calculate trajectory prediction
        // Project current position forward based on velocity
        const projectionTimeMs = 500; // 500ms projection
        const projectionTimeSec = projectionTimeMs / 1000;
        this.projectedX = this.cursorX + (this.cursorVelocityX * projectionTimeSec);
        this.projectedY = this.cursorY + (this.cursorVelocityY * projectionTimeSec);
        // Calculate distance from projected position to target
        this.projectedDistance = Math.sqrt(Math.pow(this.projectedX - this.targetCenterX, 2) +
            Math.pow(this.projectedY - this.targetCenterY, 2));
        // Determine if cursor is approaching target
        this.isApproachingTarget = this.projectedDistance < this.distanceToTarget;
        // Check if trajectory intersects with target (simplified approach)
        // Create a bounding box slightly larger than the target
        const expandedTargetLeft = this.targetX - 10;
        const expandedTargetRight = this.targetX + this.targetWidth + 10;
        const expandedTargetTop = this.targetY - 10;
        const expandedTargetBottom = this.targetY + this.targetHeight + 10;
        // Check if the line segment from current position to projected position intersects the expanded target
        this.trajectoryIntersectsTarget = this.lineIntersectsRect(this.cursorX, this.cursorY, this.projectedX, this.projectedY, expandedTargetLeft, expandedTargetTop, expandedTargetRight, expandedTargetBottom);
        // Update dwell time tracking
        if (this.distanceToTarget < this.dwellThreshold) {
            // Cursor is near the target
            if (!this.isDwelling) {
                // Just started dwelling
                this.isDwelling = true;
                this.dwellStartTime = now;
            }
            // Update dwell duration
            this.dwellDuration = now - this.dwellStartTime;
        }
        else {
            // Cursor is away from target
            if (this.isDwelling) {
                // Just stopped dwelling
                this.isDwelling = false;
                this.dwellDuration = 0;
            }
        }
        // Update user state
        this.updateUserState();
        // Update intent scores
        this.updateButtonIntentScore();
    }
    /**
     * Check if a line segment intersects with a rectangle
     * Used for trajectory intersection detection
     */
    lineIntersectsRect(x1, y1, // Line start point
    x2, y2, // Line end point
    rectLeft, rectTop, // Rectangle top-left
    rectRight, rectBottom // Rectangle bottom-right
    ) {
        // Check if either endpoint is inside the rectangle
        if (this.pointInRect(x1, y1, rectLeft, rectTop, rectRight, rectBottom) ||
            this.pointInRect(x2, y2, rectLeft, rectTop, rectRight, rectBottom)) {
            return true;
        }
        // Check if the line intersects any of the rectangle's edges
        // Top edge
        if (this.lineSegmentsIntersect(x1, y1, x2, y2, rectLeft, rectTop, rectRight, rectTop)) {
            return true;
        }
        // Right edge
        if (this.lineSegmentsIntersect(x1, y1, x2, y2, rectRight, rectTop, rectRight, rectBottom)) {
            return true;
        }
        // Bottom edge
        if (this.lineSegmentsIntersect(x1, y1, x2, y2, rectLeft, rectBottom, rectRight, rectBottom)) {
            return true;
        }
        // Left edge
        if (this.lineSegmentsIntersect(x1, y1, x2, y2, rectLeft, rectTop, rectLeft, rectBottom)) {
            return true;
        }
        return false;
    }
    /**
     * Check if a point is inside a rectangle
     */
    pointInRect(x, y, // Point
    rectLeft, rectTop, // Rectangle top-left
    rectRight, rectBottom // Rectangle bottom-right
    ) {
        return x >= rectLeft && x <= rectRight && y >= rectTop && y <= rectBottom;
    }
    /**
     * Check if two line segments intersect
     */
    lineSegmentsIntersect(x1, y1, // First line start
    x2, y2, // First line end
    x3, y3, // Second line start
    x4, y4 // Second line end
    ) {
        // Calculate the direction of the lines
        const d1x = x2 - x1;
        const d1y = y2 - y1;
        const d2x = x4 - x3;
        const d2y = y4 - y3;
        // Calculate the determinant
        const determinant = d1x * d2y - d1y * d2x;
        // If determinant is zero, lines are parallel
        if (determinant === 0) {
            return false;
        }
        // Calculate the parameters for the intersection point
        const s = (d1x * (y1 - y3) - d1y * (x1 - x3)) / determinant;
        const t = (d2x * (y1 - y3) - d2y * (x1 - x3)) / determinant;
        // Check if the intersection point is within both line segments
        return s >= 0 && s <= 1 && t >= 0 && t <= 1;
    }
    /**
     * Track scroll events
     * @param event Scroll event
     */
    trackScroll() {
        const now = Date.now();
        const scrollDelta = window.scrollY - (this.scrollAmount || 0);
        this.scrollDirection = scrollDelta > 0 ? 'down' : (scrollDelta < 0 ? 'up' : 'none');
        this.scrollAmount = window.scrollY;
        this.lastScrollTimestamp = now;
        // Update intent scores
        this.readingIntentScore = Math.min(100, this.readingIntentScore + 10);
        this.buttonIntentScore = Math.max(0, this.buttonIntentScore - 20);
        // Notify listeners
        if (this.onButtonIntentChange) {
            this.onButtonIntentChange(this.buttonIntentScore);
        }
    }
    /**
     * Track click events
     * @param event Click event
     */
    trackClick(event) {
        this.lastClickTimestamp = Date.now();
        // Clicks in the upper third of the screen might indicate button intent
        if (event.clientY < this.viewportHeight / 3) {
            this.buttonIntentScore = Math.min(100, this.buttonIntentScore + 30);
            if (this.onButtonIntentChange) {
                this.onButtonIntentChange(this.buttonIntentScore);
            }
        }
    }
    /**
     * Update the button intent score based on current metrics
     * Creates a continuous gradient field across the entire screen
     */
    updateButtonIntentScore() {
        const now = Date.now();
        let newScore = 0; // Start fresh each time
        // Normalize distance as a percentage of screen size
        const screenDiagonal = Math.sqrt(Math.pow(this.viewportWidth, 2) +
            Math.pow(this.viewportHeight, 2));
        const normalizedDistance = this.distanceToTarget / screenDiagonal;
        // Calculate proximity score with a more gradual falloff
        // This creates a gradient field that extends across the entire screen
        // Using inverse distance for a more natural feel
        const proximityFactor = 1 / (1 + normalizedDistance * 2);
        // Movement factors
        const isMovingSlowly = this.cursorSpeed < 300;
        const isMovingVerySlowly = this.cursorSpeed < 100;
        // Time-based factors
        const recentlyScrolled = now - this.lastScrollTimestamp < 800;
        const recentlyClicked = now - this.lastClickTimestamp < 1000;
        // User state factors
        const isActivelyReading = this.userState === 'reading' || this.userState === 'selecting';
        const isActivelyScrolling = this.userState === 'scrolling';
        // Calculate new score with weighted factors
        // 1. Base score from proximity (gradient across entire screen)
        // This ensures every position has some intent value
        const proximityScore = proximityFactor * 40;
        newScore += proximityScore;
        // 2. Trajectory factors (up to 35 points)
        // Reward cursor trajectories that would hit the target
        if (this.trajectoryIntersectsTarget) {
            // Strong boost for trajectories that would hit the target
            newScore += 35;
        }
        else if (this.isApproachingTarget) {
            // Medium boost for trajectories that are moving toward the target
            // Scale based on how much closer the trajectory gets
            const approachFactor = (this.distanceToTarget - this.projectedDistance) / this.distanceToTarget;
            newScore += Math.max(0, approachFactor * 25);
        }
        // 3. Movement alignment with target (up to 25 points)
        // How directly is the cursor moving toward the target?
        if (this.movementAlignmentWithTarget > 0) {
            // Linear scaling for more gradual effect
            const alignmentScore = this.movementAlignmentWithTarget * 25;
            newScore += alignmentScore;
        }
        else if (this.movementAlignmentWithTarget < 0) {
            // Penalty for moving away, but less severe to maintain gradient
            newScore -= Math.abs(this.movementAlignmentWithTarget) * 10;
        }
        // 4. Dwell time near target (up to 20 points)
        // Reward lingering near the target
        if (this.isDwelling) {
            // Logarithmic increase that caps out around 2 seconds
            const dwellFactor = Math.min(1, Math.log10(1 + this.dwellDuration / 1000) / Math.log10(3));
            newScore += dwellFactor * 20;
        }
        // 5. Speed factors - more gradual effects
        // Very slow movement near target suggests deliberate positioning
        if (isMovingVerySlowly) {
            // Bonus scales with proximity
            newScore += 10 * proximityFactor;
        }
        else if (!isMovingSlowly) {
            // Penalty scales with speed but is less severe
            newScore -= Math.min(10, this.cursorSpeed / 50);
        }
        // 6. Penalties for conflicting activities
        // These are strong signals that the user is NOT interested in the target
        // But we reduce their severity to maintain some gradient
        if (isActivelyScrolling || recentlyScrolled) {
            newScore -= 40; // Scrolling is a clear signal of non-target intent
        }
        if (isActivelyReading) {
            newScore -= 25; // Reading is a signal of non-target intent
        }
        if (this.isSelecting) {
            newScore -= 50; // Text selection is the strongest signal of non-target intent
        }
        if (recentlyClicked && this.distanceToTarget > this.targetWidth * 2) {
            newScore -= 15; // Clicking elsewhere is a signal of non-target intent
        }
        // 7. Natural decay over time
        // More gradual decay for smoother transitions
        const decayRate = Math.max(0.3, 1 - (newScore / 100)); // 0.3 to 1.0
        const oldScoreWeight = Math.max(0, Math.min(0.8, this.buttonIntentScore / 100)); // 0 to 0.8
        // Blend old and new scores for smoother transitions
        // Higher old scores get more weight to prevent flickering
        const blendedScore = (newScore * (1 - oldScoreWeight)) + (this.buttonIntentScore * oldScoreWeight);
        // Apply decay
        newScore = Math.max(0, blendedScore - decayRate);
        // Clamp score between 0-100
        newScore = Math.max(0, Math.min(100, newScore));
        // Update more frequently for smoother gradient transitions
        if (Math.abs(newScore - this.buttonIntentScore) > 1) { // More sensitive updates
            this.buttonIntentScore = newScore;
            if (this.onButtonIntentChange) {
                this.onButtonIntentChange(this.buttonIntentScore);
            }
        }
    }
    /**
     * Get the current button intent score (0-100)
     */
    getButtonIntentScore() {
        return this.buttonIntentScore;
    }
    /**
     * Set a callback for button intent score changes
     * @param callback Function to call when button intent score changes
     */
    setButtonIntentCallback(callback) {
        this.onButtonIntentChange = callback;
    }
    /**
     * Check if the user likely intends to interact with the button
     * @param threshold Score threshold (default: 30)
     */
    hasButtonIntent(threshold = 30) {
        return this.buttonIntentScore >= threshold;
    }
    /**
     * Get debug data for development and tuning
     */
    getDebugData() {
        return {
            viewport: { width: this.viewportWidth, height: this.viewportHeight },
            cursor: {
                x: this.cursorX,
                y: this.cursorY,
                velocityX: this.cursorVelocityX,
                velocityY: this.cursorVelocityY,
                speed: this.cursorSpeed
            },
            target: {
                x: this.targetX,
                y: this.targetY,
                width: this.targetWidth,
                height: this.targetHeight,
                centerX: this.targetCenterX,
                centerY: this.targetCenterY,
                distance: this.distanceToTarget,
                alignment: this.movementAlignmentWithTarget,
                isDwelling: this.isDwelling,
                dwellDuration: this.dwellDuration,
                dwellThreshold: this.dwellThreshold
            },
            trajectory: {
                projectedX: this.projectedX,
                projectedY: this.projectedY,
                projectedDistance: this.projectedDistance,
                isApproaching: this.isApproachingTarget,
                intersectsTarget: this.trajectoryIntersectsTarget
            },
            state: {
                current: this.userState,
                isSelecting: this.isSelecting,
                smallMovementCount: this.smallMovementCount,
                lastScrollTime: Date.now() - this.lastScrollTimestamp,
                lastClickTime: Date.now() - this.lastClickTimestamp
            },
            scores: {
                button: this.buttonIntentScore,
                reading: this.readingIntentScore,
                exploring: this.exploringIntentScore
            }
        };
    }
}
exports.UserIntentTracker = UserIntentTracker;
// Helper function to get the tracker instance
function getUserIntentTracker() {
    // Only create in browser environment
    if (typeof window === 'undefined') {
        throw new Error('UserIntentTracker can only be used in browser environment');
    }
    return UserIntentTracker.getInstance();
}
//# sourceMappingURL=UserIntentTracker.js.map