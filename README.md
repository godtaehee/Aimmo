# BoradAPI
원티드 프리 온보딩 (에이모 기업과제 1주차) 10조 

## 사용 기술스택

### TypeScript

### Express

### MongoDB


## 실행방법

### 1.해당 레포지토리를 clone합니다.

```shell
git clone https://github.com/godtaehee/Aimmo
```


### 2. 다운 받으신 폴더로 들어갑니다

```shell
cd Aimmo
```


### 3. 의존성들을 설치합니다.

```shell
npm i
```

### 4. Swagger 문서를 build합니다

```shell
npm run api-docs
```

### 5. 실행시킵니다!

```shell
npm start
```

## API 명세서

```shell
http://localhost:3000/api-docs
```

혹은

```shell
http://52.78.137.213:3000/api-docs/
```

에서 확인하실수 있습니다.

![Screen Shot 2021-11-03 at 8 20 37 AM](https://user-images.githubusercontent.com/44861205/139965105-a8c0137a-8b3d-4272-b549-b8608e60ce9a.png)

## 배포된 환경의 주소

위에서 언급된 주소와 같습니다.

```shell
http://52.78.137.213:3000/api-docs/
```


- 원티드 지원 과제 내용 포함
  - 해당 프로젝트는 [링크](https://github.com/earthkingman/CRUD-API-NodeJS) 의 프로젝트 기반으로 만들었습니다.

- 게시글 카테고리
  - 게시글을 생성할때 카테고리를 정할수 있습니다. 카테고리의 종류는 WEB, APP, GAME, ALGORITHM, INFRA, DATABASE가 있습니다.

- 게시글 검색
  - GET /post/condition API를 사용하여 검색 하실수 있습니다. Search Keyword는 title과 category입니다 추후 Keyword를 자유자재로 변경가능하게 해놓았습니다. title을 포함하고있는 데이터는 모두 검색의 결과로서 나타납니다. 
- 대댓글(1 depth)
    - 대댓글 pagination
      - 기본 댓글은 0 depth, 대댓글은 1의 depth를 가지고있습니다. 대댓글의 페이지네이션은 GET /comment/page에서 확인하실수 있습니다.

![Screen Shot 2021-11-03 at 8 30 40 AM](https://user-images.githubusercontent.com/44861205/139965829-d6dc7807-2b24-4bc2-81f4-78c3194a5d90.png)

Client가 처음엔 페이지네이션 된 버튼을 누르는게 아닌 단순히 검색버튼을 눌렀을것이라고 가정하였습니다.

따라서 처음 offset은 0으로 해주셔야하며, 이후에는 검색된 대댓글의 마지바막 데이터의 MongoDB 고유 Id를 offset으로 넣어 주셔야 합니다.

`typeorm-seed`를 통해 200만개의 데이터를 생성했습니다. 1000만데이터까지 생성하지 못한 이유는 MongoDB의 Atlas 프리티어 용량이 512MB인데 200만개의 데이터부터 해당 용량을 초과하게 되어 데이터를 더 생성하지 못했습니다.

요구사항의 5분의 1인 200만개의 데이터를 가지고 실험해보았을때 offset이 없는 Pagination으로 페이지네이션의 성능향상을 기대했지만 최종적으로 페이지네이션의 성능향상을 이루지 못했습니다.

아래의 사진들은 제가 직접 실험해보았으며, 실패한 결과입니다.

## 일반적인 MongoDB의 TypeORM을 사용한 Pagination

구현 코드는 아래와 같습니다.

```typescript
this.commentRepository.find({
      take: pageInfo.limit,
      where: {
        depth: 1,
      },
      order: {
        created_at: "DESC",
      },
      skip: pageInfo.offset,
    });
```


![Screen Shot 2021-11-03 at 8 41 32 AM](https://user-images.githubusercontent.com/44861205/139966583-df796ceb-b506-4f16-85da-44a29bd8c64f.png)

사진은 offset이 1,2,3,100,천, 만, 십만 번째의 페이지부터 시작하여 20개의 대댓글을 가져오는 경우의 소요시간입니다.

이처럼 거의 마지막 데이터인 200만번째의 데이터를 가져왔을때 2.7초가 걸리는것을 확인하실수 있습니다.

이는 실제 API로 사용하기엔 너무 느리며 개선을 필요로합니다.

> RDBMS의 페이지네이션 성능향상은 [해당 Repository](https://github.com/godtaehee/Free-Onboarding-Course-Backend)의 리드미에서 확인하실수 있습니다.


## No Offset

No Offset을 이용하여 구현한 소스코드입니다.

```typescript
let commentList;

    if (pageInfo.offset === "0") {
      commentList = await this.commentRepository.find({
        take: pageInfo.limit,
        where: {
          depth: 1,
        },
        order: {
          created_at: "DESC",
        },
      });
    } else {
      commentList = await this.commentRepository.find({
        take: pageInfo.limit,
        where: {
          _id: { $lt: new ObjectID(pageInfo.offset) },
          depth: 1,
        },
        order: {
          created_at: "DESC",
        },
      });
    }
```

[해당글](https://medium.com/swlh/mongodb-pagination-fast-consistent-ece2a97070f3) 을 참고하여 Offset을 없애고 limit값만 사용함으로서 성능향상을 기대했지만 
아래와 같이 성능이 배로 나빠지는경험을 했습니다.

![Screen Shot 2021-11-03 at 8 48 33 AM](https://user-images.githubusercontent.com/44861205/139967054-8d99c67b-e54b-47f9-9484-01c365281c22.png)

첫번째의 페이지를 불러오는데만 5초가 걸렸고 그 이후에도 더 나아지지 않고 5초의 시간보다 빠르게 응답하지 못했습니다.

Random하게 페이지 사이를 이동할수 있다라는 점을 포기했음에도 불구하고 성능이 앞서 보여드린 Offset을 사용한 페이지네이션보다 좋지 못했습니다.

200만 데이터가 갖춰진상태였고, 글을 읽고 잘 이해한 상태에서 로직을 작성한것으로 생각했지만 분명한 실패였습니다.

따라서 저는 해당 사항에 대해서는 NoSQL과 MongoDB에 대한 더 깊은 이해가 선행되야겠다고 판단을 하였습니다. 


- 게시글 읽힘 수
    - 같은 User가 게시글을 읽는 경우 count 수 증가하면 안 됨
    
비회원도 공개된 글은 볼수 있어야한다고 생각합니다. 따라서 비회원이 특정 게시글을 볼때는 조회수가 계속 올라가게 하였으며, 회원이 게시글을 읽었을때는 1번 이후로는 절대 조회수가 오르지 않게 하였습니다.

```typescript
 async selectPost(requestInfo): Promise<any> {
    const post = await this.postRepository.findOne(requestInfo.id);
    if (post === undefined) {
      await this.queryRunner.release();
      throw new PostNotFoundException(String(requestInfo.id));
    } else {
      await this.queryRunner.release();
      if (!requestInfo.userId || !post.views?.includes(requestInfo.userId)) {
        if (requestInfo.userId) {
          post.views.push(requestInfo.userId);
        }
        post.count += 1;
        await this.postRepository.update(requestInfo.id, post);
        return post;
      }
      return post;
    }
  }
```

로직의 원리는 post의 views라는 배열을 만들어 해당 배열에 유저의 아이디를 가지고 있게 했습니다. 따라서 한번 배열에 포함된 유저의 아이디는 똑같은 유저가 다음번에도 같은 게시글을 봤을때 Validation 역할을 해줍니다.

원래는 Set으로하여 시간을 줄여볼까 했지만 MongoDB의 타입중에 Set은 없기도 하고 Auto-Generated된 값이 다양한 문자와 숫자들의 조합이라 이렇게 배열로 정하게 됬습니다.

MongoDB도 Auto-Generated된 숫자 Value를 생성할수 있지만 기본으로 제공되는 ObjectId에 더해 필드가 더 하나 생기기때문에 생성하지 않았습니다.

비회원 혹은 게시글을 아직 보지않은 회원의 조회수는 반영이됩니다.

- Rest API 설계
  - Rest API를 이용하여 설계하였습니다.
- Unit Test
  - Unit Test는 진행하지 못했습니다.
- 1000만건 이상의 데이터를 넣고 성능테스트 진행 결과 필요
  - 성능 테스트에 관한 부분은 윗부분에 있습니다.
