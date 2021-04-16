import { Arg, Field, ID, InputType, Mutation, ObjectType, Resolver } from 'type-graphql'
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Application } from './application'

@ObjectType()
@Entity()
export class Review extends BaseEntity {
  @Field(() => ID) @PrimaryGeneratedColumn('uuid') id: string
  @Field() @Column() title: string
  @Field() @Column() body: string

  @Field(() => Application)
  @ManyToOne(() => Application, (application) => application.reviews)
  @JoinColumn({ name: 'applicationId', referencedColumnName: 'id' })
  application: Application
}

@InputType()
export class CreateReviewInput {
  @Field() applicationId: string
  @Field() title: string
  @Field() body: string
}

@Resolver()
export class ReviewResolver {
  @Mutation(() => Application)
  async createReview(
    @Arg('input', () => CreateReviewInput) input: CreateReviewInput
  ): Promise<Application> {
    const application = await Application.findOneOrFail(input.applicationId)
    if (['published', 'inReview'].includes(application.state))
      throw new Error('Application not in a reviewable state')

    const review = await Review.create({ application, ...input }).save()
    application.reviews = [...(application.reviews || []), review]

    await application.transition('review', false)
    return application
  }
}
