type TPiorityObject = {
    piority: number
}

export function selectFromPiority<T extends TPiorityObject>(
    data: T[] | { [key: string]: T }
): T {
    const currentData = !Array.isArray(data) ? Object.values(data) : data;
    const sumPiority = currentData.reduce((a, b) => a + b.piority, 0);
    const randomPoint = sumPiority * Math.random();
    const allActionPoints = currentData.map(_data => Math.abs(_data.piority - randomPoint));
    const closestPoint = Math.min(...allActionPoints);

    return currentData[allActionPoints.findIndex(_point => _point === closestPoint)];
}
