// 해시 생성 함수
export const generateHash = async (data: string) => {
    try {
        const hashBuffer = await window.crypto.subtle.digest(
            'SHA-256',
            new TextEncoder().encode(data)
        );
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
    } catch (error) {
        console.error("Error generating hash:", error);
        return 'undefined';
    }
};