import { createMachine, StateMachine } from '@xstate/fsm'
import { Arg, Field, ID, Mutation, ObjectType, Query, Resolver } from 'type-graphql'
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Review } from './review'

@ObjectType()
@Entity()
export class Application extends BaseEntity {
  constructor() {
    super()
    this.machine = createMachine({
      id: 'state',
      initial: 'draft',
      states: {
        draft: { on: { submit: 'published' } },
        published: { on: { review: 'inReview' } },
        inReview: { on: { review: 'inReview', finalize: 'reviewed' } },
        reviewed: { on: { accept: 'accepted', reject: 'rejected' } },
        accepted: { on: { final: 'final' } },
        rejected: { on: { final: 'final' } },
      },
    })
  }

  machine: StateMachine.Machine<any, any, any>

  @Field(() => ID) @PrimaryGeneratedColumn('uuid') id: string
  @Field() @Column() title: string
  @Field() @Column() excerpt: string
  @Field() @Column({ default: 'draft' }) state: string

  @Field(() => [Review], { nullable: true })
  @OneToMany(() => Review, (review) => review.application, { eager: true })
  reviews: Review[]

  transition(action: string, fail: boolean = true): Promise<Application> {
    const nextState = this.machine.transition(this.state, action)
    if (!nextState.changed && fail)
      throw new Error(
        `Invalid transition using action ${action} from ${this.state} to ${nextState.value}`
      )

    this.state = nextState.value
    return this.save()
  }
}

@Resolver()
export class ApplicationResolver {
  @Query(() => [Application])
  applications(): Promise<Application[]> {
    return Application.find()
  }

  @Query(() => Application)
  application(@Arg('id', () => ID) id: string): Promise<Application> {
    return Application.findOneOrFail(id)
  }

  @Mutation(() => Application)
  async submitApplication(@Arg('id') id: string): Promise<Application> {
    const application = await Application.findOneOrFail(id)
    if (application.state != 'draft') throw new Error('Application not draft')

    return await application.transition('submit')
  }

  @Mutation(() => Application)
  async completeReviewOfApplication(@Arg('id') id: string): Promise<Application> {
    const application = await Application.findOneOrFail(id)
    if (application.state != 'inReview') throw new Error('Application is not in review')

    return await application.transition('finalize')
  }

  @Mutation(() => Application)
  async acceptApplication(@Arg('id') id: string): Promise<Application> {
    const application = await Application.findOneOrFail(id)
    if (application.state != 'reviewed') throw new Error('Application review must be completed')

    return await application.transition('accept')
  }

  @Mutation(() => Application)
  async rejectApplication(@Arg('id') id: string): Promise<Application> {
    const application = await Application.findOneOrFail(id)
    if (application.state != 'reviewed') throw new Error('Application review must be completed')

    return await application.transition('reject')
  }
}
