// 동적 라우트
export function getServerSideProps(req) {
  return {
    props: {
      user: req.params.user,
    },
  };
}

export default function GreetUser({ user }) {
  return (
    <div>
      <h1>Hello {user}!</h1>
    </div>
  );
}
